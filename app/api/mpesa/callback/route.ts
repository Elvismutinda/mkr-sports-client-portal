import { db } from "@/lib/db/db";
import { match, matchPlayers, payments, user } from "@/lib/db/schema";
import { sendMatchRegistrationEmail } from "@/lib/mail";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const body = await req.json();

  const result = body.Body.stkCallback;
  const checkoutId = result.CheckoutRequestID;
  const success = result.ResultCode === 0;

  // 1️⃣ Fetch payment record
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.checkoutRequestId, checkoutId));

  if (!payment) return new Response("OK");

  if (!success) {
    await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.id, payment.id));

    return new Response("OK");
  }

  // 2️⃣ Payment successful → transaction
  await db.transaction(async (tx) => {
    // Update payment status
    await tx
      .update(payments)
      .set({ status: "success" })
      .where(eq(payments.id, payment.id));

    // Insert into matchPlayers
    const [userPos] = await tx
      .select({ position: user.position })
      .from(user)
      .where(eq(user.id, payment.userId));

    await tx.insert(matchPlayers).values({
      matchId: payment.matchId,
      playerId: payment.userId,
      position: userPos.position,
    });
  });

  // 3️⃣ Fetch user + match for email
  const [userData] = await db
    .select({
      email: user.email,
      name: user.name,
    })
    .from(user)
    .where(eq(user.id, payment.userId));

  const [matchData] = await db
    .select({
      id: match.id,
      location: match.location,
      date: match.date,
    })
    .from(match)
    .where(eq(match.id, payment.matchId));

  // 4️⃣ Send confirmation email ONLY if not sent before
  if (userData?.email && matchData && !payment.emailSent) {
    await sendMatchRegistrationEmail({
      email: userData.email,
      name: userData.name,
      match: matchData,
    });

    // Mark email as sent
    await db
      .update(payments)
      .set({ emailSent: true })
      .where(eq(payments.id, payment.id));
  }

  // 5️⃣ Revalidate match page
  revalidatePath(`/matches/${payment.matchId}`);

  return new Response("OK");
}
