import { db } from "@/lib/db/db";
import { match, matchPlayers, payments, user } from "@/lib/db/schema";
import { sendMatchRegistrationEmail } from "@/lib/mail";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Always 200 — Safaricom retries on any other status code,
// which risks duplicate inserts against the unique matchPlayers index.
const OK = () => new Response("OK", { status: 200 });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = body?.Body?.stkCallback;

    if (!result) {
      console.error(
        "[mpesa/callback] Malformed payload:",
        JSON.stringify(body),
      );
      return OK();
    }

    const checkoutId: string = result.CheckoutRequestID;
    const success: boolean = result.ResultCode === 0;

    console.log(
      `[mpesa/callback] checkoutId=${checkoutId} success=${success} code=${result.ResultCode}`,
    );

    // 1. Find payment record
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.checkoutRequestId, checkoutId));

    if (!payment) {
      console.error(
        "[mpesa/callback] No payment record for checkoutId:",
        checkoutId,
      );
      return OK();
    }

    // 2. Idempotency — Safaricom sometimes fires the callback twice
    if (payment.status === "success") {
      console.log("[mpesa/callback] Already processed, skipping:", checkoutId);
      return OK();
    }

    // 3. Payment failed / cancelled
    if (!success) {
      await db
        .update(payments)
        .set({ status: "failed" })
        .where(eq(payments.id, payment.id));

      console.log(
        `[mpesa/callback] Failed. code=${result.ResultCode} desc=${result.ResultDesc}`,
      );
      return OK();
    }

    // 4. Extract M-Pesa receipt number from callback metadata
    const mpesaItems = result.CallbackMetadata?.Item as
      | { Name: string; Value?: string | number }[]
      | undefined;

    const mpesaReceiptNumber = mpesaItems?.find(
      (i) => i.Name === "MpesaReceiptNumber",
    )?.Value as string | undefined;

    // 5. Transaction: mark payment success + insert player (idempotent)
    await db.transaction(async (tx) => {
      await tx
        .update(payments)
        .set({ status: "success" })
        .where(eq(payments.id, payment.id));

      // Guard against duplicate insert (unique_match_player index would throw)
      const [alreadyEnlisted] = await tx
        .select({ id: matchPlayers.id })
        .from(matchPlayers)
        .where(
          and(
            eq(matchPlayers.matchId, payment.matchId),
            eq(matchPlayers.playerId, payment.userId),
          ),
        );

      if (!alreadyEnlisted) {
        const [playerRecord] = await tx
          .select({ position: user.position })
          .from(user)
          .where(eq(user.id, payment.userId));

        await tx.insert(matchPlayers).values({
          matchId: payment.matchId,
          playerId: payment.userId,
          position: playerRecord.position,
        });

        // Append userId to match.registeredPlayerIds
        const [currentMatch] = await tx
          .select({ registeredPlayerIds: match.registeredPlayerIds })
          .from(match)
          .where(eq(match.id, payment.matchId));

        await tx
          .update(match)
          .set({
            registeredPlayerIds: sql`${JSON.stringify([
              ...(currentMatch.registeredPlayerIds ?? []),
              payment.userId,
            ])}::jsonb`,
          })
          .where(eq(match.id, payment.matchId));

        console.log(
          `[mpesa/callback] Enlisted player=${payment.userId} match=${payment.matchId} receipt=${mpesaReceiptNumber}`,
        );
      }
    });

    // 6. Send confirmation email — isolated so a broken SMTP config
    //    doesn't roll back the player insert above
    if (!payment.emailSent) {
      try {
        const [userData] = await db
          .select({ email: user.email, name: user.name })
          .from(user)
          .where(eq(user.id, payment.userId));

        const [matchData] = await db
          .select({ id: match.id, location: match.location, date: match.date })
          .from(match)
          .where(eq(match.id, payment.matchId));

        if (userData?.email && matchData) {
          await sendMatchRegistrationEmail({
            email: userData.email,
            name: userData.name,
            match: matchData,
          });

          await db
            .update(payments)
            .set({ emailSent: true })
            .where(eq(payments.id, payment.id));

          console.log(`[mpesa/callback] Email sent to ${userData.email}`);
        }
      } catch (emailErr) {
        console.error(
          "[mpesa/callback] Email failed (player still added):",
          emailErr,
        );
      }
    }

    // 7. Revalidate match page so UI reflects the new player
    revalidatePath(`/matches/${payment.matchId}`);

    return OK();
  } catch (err) {
    console.error("[mpesa/callback] Unhandled error:", err);
    return OK(); // always 200
  }
}
