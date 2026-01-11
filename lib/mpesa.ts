import axios from "axios";

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

  return res.data.access_token;
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
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);

  const password = Buffer.from(
    `${SHORTCODE}${PASSKEY}${timestamp}`
  ).toString("base64");

  const res = await axios.post(
    `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: CALLBACK_URL,
      AccountReference: accountRef,
      TransactionDesc: description,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
}
