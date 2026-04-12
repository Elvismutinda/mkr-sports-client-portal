import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as SMTPTransport.Options);

const FROM = `MKR Sports <${process.env.SMTP_USER}>`;
const BASE_URL = process.env.NEXTAUTH_URL;

function logoRow() {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px">
      <tr>
        <td>
          <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px">MKR</span>
          <span style="font-size:11px;font-weight:700;color:#ffea00;letter-spacing:0.25em;text-transform:uppercase;margin-left:6px">SPORTS</span>
        </td>
      </tr>
    </table>`;
}

function wrapper(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f9;padding:40px 0">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" border="0"
      style="background-color:#0f1623;border-radius:12px;overflow:hidden;max-width:480px;width:100%">
      <tr><td style="padding:36px 40px 40px 40px">
        ${logoRow()}
        ${body}
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function primaryButton(href: string, label: string) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td align="center">
        <a href="${href}"
          style="display:block;width:100%;box-sizing:border-box;background-color:#2a79b5;color:#ffffff;font-size:13px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;text-align:center;padding:16px 0;border-radius:6px;line-height:1">
          ${label}
        </a>
      </td></tr>
    </table>`;
}

function divider() {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0">
    <tr><td style="border-top:1px solid #1e2d42;font-size:0">&nbsp;</td></tr>
  </table>`;
}

function directUrl(href: string) {
  return `
    <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#4a5f7a;letter-spacing:0.15em;text-transform:uppercase">DIRECT URL:</p>
    <p style="margin:0;font-size:13px;line-height:1.5;word-break:break-all">
      <a href="${href}" style="color:#2a79b5;text-decoration:none">${href}</a>
    </p>`;
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${BASE_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Verify your MKR Sports account",
    html: wrapper(`
      <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#ffea00;letter-spacing:0.2em;text-transform:uppercase">
        PLAYER ACCOUNT
      </p>

      <p style="margin:0 0 16px 0;font-size:26px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:-0.5px;line-height:1.1">
        ACCOUNT VERIFICATION
      </p>

      <p style="margin:0 0 32px 0;font-size:14px;color:#8a9ab5;line-height:1.6">
        Welcome to MKR Sports. Verify your email to activate your account and start booking matches.
      </p>

      ${primaryButton(confirmLink, "VERIFY EMAIL")}

      <p style="margin:0 0 28px 0;font-size:11px;font-weight:700;color:#ffea00;letter-spacing:0.15em;text-transform:uppercase;text-align:center">
        THIS LINK EXPIRES IN 2 MINUTES
      </p>

      <p style="margin:0;font-size:12px;color:#4a5f7a;text-align:center">
        If you didn’t request this, you can ignore this email.
      </p>

      ${divider()}
      ${directUrl(confirmLink)}
    `),
  });
};

export async function sendPlayerPasswordResetEmail(
  email: string,
  token: string,
) {
  const link = `${BASE_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Reset your MKR Sports password",
    html: wrapper(`
      <p style="margin:0 0 16px 0;font-size:26px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:-0.5px;line-height:1.1">
        PASSWORD RESET
      </p>
      <p style="margin:0 0 32px 0;font-size:14px;color:#8a9ab5;line-height:1.6">
        We received a request to reset your MKR Sports password.
        Click the button below to choose a new password.
      </p>
      ${primaryButton(link, "RESET PASSWORD")}
      <p style="margin:0 0 28px 0;font-size:11px;font-weight:700;color:#ffea00;letter-spacing:0.15em;text-transform:uppercase;text-align:center">
        THIS LINK EXPIRES IN 30 MINUTES
      </p>
      <p style="margin:0 0 0 0;font-size:12px;color:#4a5f7a;text-align:center">
        If you didn't request this, you can safely ignore this email.
      </p>
      ${divider()}
      ${directUrl(link)}
    `),
  });
}

export const sendMatchRegistrationEmail = async ({
  email,
  name,
  match,
  playerCount = 1,
}: {
  email: string;
  name?: string | null;
  match: { id: string; location: string; date: Date | string };
  playerCount?: number;
}) => {
  const matchDate = new Date(match.date);
  const matchLink = `${process.env.NEXT_PUBLIC_BASE_URL}/matches/${match.id}`;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Match Registration Confirmed",
    html: wrapper(`
      <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#2a79b5;letter-spacing:0.2em;text-transform:uppercase">
        MATCH CONFIRMATION
      </p>

      <p style="margin:0 0 16px 0;font-size:26px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:-0.5px;line-height:1.1">
        YOU'RE IN ⚽
      </p>

      <p style="margin:0 0 24px 0;font-size:14px;color:#8a9ab5;line-height:1.6">
        Hi ${name ?? "Captain"}, your payment was successful and 
        <strong>${playerCount} player${playerCount > 1 ? "s have" : " has"} been confirmed</strong>.
      </p>

      <p style="margin:0 0 8px 0;font-size:13px;color:#ffffff">
        <strong>Venue:</strong> ${match.location}
      </p>

      <p style="margin:0 0 8px 0;font-size:13px;color:#ffffff">
        <strong>Date:</strong> ${matchDate.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <p style="margin:0 0 24px 0;font-size:13px;color:#ffffff">
        <strong>Time:</strong> ${matchDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      ${primaryButton(matchLink, "VIEW MATCH")}

      <p style="margin:0;font-size:12px;color:#4a5f7a;text-align:center">
        Need help? Just reply to this email.
      </p>

      ${divider()}
      ${directUrl(matchLink)}
    `),
  });
};
