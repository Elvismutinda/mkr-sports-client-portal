import { db } from "@/lib/db/db";
import { match, matchPlayer, payment, user } from "@/lib/db/schema";
import { sendMatchRegistrationEmail } from "@/lib/mail";
import { eq, and, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const OK = () => new Response("OK", { status: 200 });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = body?.Body?.stkCallback;

    if (!result) {
      console.error("[mpesa/callback] Malformed payload:", JSON.stringify(body));
      return OK();
    }

    const checkoutId: string = result.CheckoutRequestID;
    const success: boolean = result.ResultCode === 0;

    // 1. Find payment record
    const [paymentRecord] = await db
      .select()
      .from(payment)
      .where(eq(payment.checkoutRequestId, checkoutId));

    if (!paymentRecord) {
      console.error("[mpesa/callback] No payment record for checkoutId:", checkoutId);
      return OK();
    }

    // 2. Idempotency
    if (paymentRecord.status === "success") {
      console.log("[mpesa/callback] Already processed:", checkoutId);
      return OK();
    }

    // 3. Payment failed
    if (!success) {
      await db
        .update(payment)
        .set({ status: "failed" })
        .where(eq(payment.id, paymentRecord.id));
      return OK();
    }

    // 4. Extract receipt
    const mpesaItems = result.CallbackMetadata?.Item as
      | { Name: string; Value?: string | number }[]
      | undefined;
    const mpesaReceiptNumber = mpesaItems?.find(
      (i) => i.Name === "MpesaReceiptNumber"
    )?.Value as string | undefined;

    // 5. Pull selected player IDs from metadata
    const meta = paymentRecord.metadata as {
      teamId?: string;
      selectedPlayerIds?: string[];
    } | null;

    const selectedPlayerIds: string[] =
      meta?.selectedPlayerIds && meta.selectedPlayerIds.length > 0
        ? meta.selectedPlayerIds
        : // Fallback for legacy single-player payments
          [paymentRecord.userId];

    if (!paymentRecord.matchId) {
      console.error("[mpesa/callback] paymentRecord.matchId is null");
      return OK();
    }

    // 6. Transaction: mark payment + insert all players
    await db.transaction(async (tx) => {
      await tx
        .update(payment)
        .set({ status: "success", mpesaReceiptNumber })
        .where(eq(payment.id, paymentRecord.id));

      // Find which players are already enlisted (idempotency)
      const alreadyEnlisted = await tx
        .select({ playerId: matchPlayer.playerId })
        .from(matchPlayer)
        .where(
          and(
            eq(matchPlayer.matchId, paymentRecord.matchId!),
            inArray(matchPlayer.playerId, selectedPlayerIds)
          )
        );

      const alreadyIds = new Set(alreadyEnlisted.map((r) => r.playerId));
      const toInsert = selectedPlayerIds.filter((id) => !alreadyIds.has(id));

      if (toInsert.length > 0) {
        // Fetch positions for each player from the user table
        const playerRecords = await tx
          .select({ id: user.id, position: user.position })
          .from(user)
          .where(inArray(user.id, toInsert));

        const positionMap = new Map(playerRecords.map((p) => [p.id, p.position]));

        await tx.insert(matchPlayer).values(
          toInsert.map((playerId) => ({
            matchId: paymentRecord.matchId!,
            playerId,
            position: positionMap.get(playerId) ?? "Midfielder",
            team: "home" as const,
          }))
        );

        // Update registeredPlayerIds on the match
        const [currentMatch] = await tx
          .select({ registeredPlayerIds: match.registeredPlayerIds })
          .from(match)
          .where(eq(match.id, paymentRecord.matchId!));

        const existingIds: string[] = currentMatch.registeredPlayerIds ?? [];
        const newIds = [...new Set([...existingIds, ...toInsert])];

        await tx
          .update(match)
          .set({
            registeredPlayerIds: sql`${JSON.stringify(newIds)}::jsonb`,
          })
          .where(eq(match.id, paymentRecord.matchId!));

        console.log(
          `[mpesa/callback] Enlisted ${toInsert.length} player(s) for match=${paymentRecord.matchId}`
        );
      }
    });

    // 7. Send confirmation email to the payer (captain)
    if (!paymentRecord.emailSent) {
      try {
        const [userData] = await db
          .select({ email: user.email, name: user.name })
          .from(user)
          .where(eq(user.id, paymentRecord.userId));

        const [matchData] = await db
          .select({ id: match.id, location: match.location, date: match.date })
          .from(match)
          .where(eq(match.id, paymentRecord.matchId!));

        if (userData?.email && matchData) {
          await sendMatchRegistrationEmail({
            email: userData.email,
            name: userData.name,
            match: matchData,
            playerCount: selectedPlayerIds.length,
          });

          await db
            .update(payment)
            .set({ emailSent: true })
            .where(eq(payment.id, paymentRecord.id));
        }
      } catch (emailErr) {
        console.error("[mpesa/callback] Email failed:", emailErr);
      }
    }

    revalidatePath(`/matches/${paymentRecord.matchId}`);
    return OK();
  } catch (err) {
    console.error("[mpesa/callback] Unhandled error:", err);
    return OK();
  }
}