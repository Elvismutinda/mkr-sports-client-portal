import axios, { AxiosError } from "axios";

const MPESA_BASE_URL = process.env.MPESA_BASE_URL!;
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL!;

export async function getMpesaToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const res = await axios.get(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return res.data.access_token as string;
}

export async function stkPush({
  phone,
  amount,
  accountRef,
  description,
}: {
  phone: string;
  amount: number;
  accountRef: string;
  description: string;
}) {
  const token = await getMpesaToken();

  // Timestamp must be in YYYYMMDDHHmmss using Africa/Nairobi time.
  // Using UTC can cause a 400 when Safaricom validates the timestamp against EAT.
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-KE", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const p = parts.reduce<Record<string, string>>((acc, { type, value }) => {
    acc[type] = value;
    return acc;
  }, {});

  const ts = `${p.year}${p.month}${p.day}${p.hour}${p.minute}${p.second}`;

  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${ts}`).toString("base64");

  // Phone: 12 digits, no + sign — e.g. 254712345678
  const cleanPhone = phone.replace(/^\+/, "").replace(/\s/g, "");

  // Amount must be a whole integer — Safaricom rejects decimals
  const cleanAmount = Math.ceil(amount);

  // AccountReference max 12 chars; TransactionDesc max 13 chars
  const cleanRef = accountRef.slice(0, 12);
  const cleanDesc = description.slice(0, 13);

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: ts,
    // "CustomerPayBillOnline" for Paybill shortcodes
    // "CustomerBuyGoodsOnline" for Till (Buy Goods) numbers
    TransactionType: "CustomerPayBillOnline",
    Amount: cleanAmount,
    PartyA: cleanPhone,
    PartyB: SHORTCODE,
    PhoneNumber: cleanPhone,
    CallBackURL: CALLBACK_URL,
    AccountReference: cleanRef,
    TransactionDesc: cleanDesc,
  };

  // Log full payload so you can spot any bad field immediately
  console.log("[stkPush] Sending →", JSON.stringify(payload, null, 2));

  try {
    const res = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("[stkPush] Success →", res.data);
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      // Safaricom's actual error message — much more useful than a plain 400
      console.error(
        "[stkPush] Safaricom error →",
        JSON.stringify(err.response.data, null, 2)
      );
      throw new Error(
        err.response.data?.errorMessage ??
          err.response.data?.ResultDesc ??
          `STK push failed (${err.response.status})`
      );
    }
    throw err;
  }
}