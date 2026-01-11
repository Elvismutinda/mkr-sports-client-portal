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

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Verify your email",
    html: `
    <div style="width:100%!important;min-width:100%;margin:0;padding:0;background-color:#ffffff">
    
    <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;height:100%;width:100%;table-layout:fixed" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
            <tr style="vertical-align:top">
                <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;background-color:#ffffff" align="center" valign="top">
                    <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;background-color:transparent" cellpadding="0" cellspacing="0" align="center" width="100%" border="0">
                        <tbody>
                            <tr style="vertical-align:top">
                                <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top" width="100%">
                                    
                                    
                                    <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;max-width:420px;margin:0 auto;text-align:inherit" cellpadding="0" cellspacing="0" align="center" width="100%" border="0">
                                        <tbody>
                                            <tr style="vertical-align:top">
                                                <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top" width="100%">
                                                    <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;width:100%;max-width:420px;color:#000000;background-color:transparent" cellpadding="0" cellspacing="0" width="100%" bgcolor="transparent">
                                                        <tbody>
                                                            <tr style="vertical-align:top">
                                                                <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;font-size:0">
                                                                    
                                                                    
                                                                    <div style="display:inline-block;vertical-align:top;width:420px">
                                                                        <table style="border-spacing:0;border-collapse:separate;vertical-align:top" cellpadding="0" cellspacing="0" align="center" width="100%" border="0">
                                                                            <tbody>
                                                                                <tr style="vertical-align:top">
                                                                                    <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;background-color:transparent;padding-top:0;padding-right:0;padding-bottom:30px;padding-left:0;border-top:1px solid #ededed;border-right:1px solid #ededed;border-bottom:1px solid #ededed;border-left:1px solid #ededed;border-radius:5px">
                                                                                        <table style="border-spacing:0;border-collapse:collapse;vertical-align:top" cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tbody>
                                                                                                <tr style="vertical-align:top">
                                                                                                    <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;padding-top:60px;padding-right:30px;padding-bottom:30px;padding-left:30px;text-align:left" align="left">
                                                                                                        <div style="color:#555555;line-height:120%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif">
                                                                                                            <div style="font-size:14px;line-height:15px;color:#555555;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif">
                                                                                                                
                                                                                                                <p style="margin:0 0 30px 0;font-size:15px;line-height:15px;font-weight:bold">Hello,
                                                                                                                </p>
                                                                                                                
                                                                                                                <p style="margin:0 0 10px 0;font-size:15px;line-height:20px">
                                                                                                                    Thanks for signing up with MKR Sports! Kindly confirm your email address by clicking the button below.
                                                                                                                </p>
                                                                                                                <div style="margin-top:30px;margin-bottom:30px;padding:0px;border:none;outline:none;list-style:none">
                                                                                                                    <a href="${confirmLink}" style="margin-top:0px;margin-bottom:0px;padding:0px;border:medium solid #3bb75e;outline:none;list-style:none;background-color:#3bb75e;color:rgb(255,255,255);display:inline-block;font-size:13px;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;width:100%;border-radius:5px" target="_blank">Confirm Email Address</a>
                                                                                                                </div>
                                                                                                                <p style="margin:0 0 10px 0;font-size:15px;line-height:20px">If you have any trouble clicking the button above, please copy and paste the URL below into your web browser.</p>
                                                                                                                <p style="margin:0 0 10px 0;font-size:14px;line-height:21px;color:#50a1f7"><a href="${confirmLink}">${confirmLink}</a></p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    
                                                                    
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;background-color:transparent" cellpadding="0" cellspacing="0" align="center" width="100%" border="0">
                        <tbody>
                            <tr style="vertical-align:top">
                                <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top" width="100%">
                                    
                                    
                                    <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;max-width:420px;margin:0 auto;text-align:inherit" cellpadding="0" cellspacing="0" align="center" width="100%" border="0">
                                        <tbody>
                                            <tr style="vertical-align:top">
                                                <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top" width="100%">
                                                    <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;width:100%;max-width:420px;color:#000000;background-color:transparent" cellpadding="0" cellspacing="0" width="100%" bgcolor="transparent">
                                                        <tbody>
                                                            <tr style="vertical-align:top">
                                                                <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;font-size:0">
                                                                    
                                                                    
                                                                    <div style="display:inline-block;vertical-align:top;width:420px">
                                                                        <table style="border-spacing:0;border-collapse:collapse;vertical-align:top" cellpadding="0" cellspacing="0" align="center" width="100%" border="0">
                                                                            <tbody>
                                                                                <tr style="vertical-align:top">
                                                                                    <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;background-color:transparent;padding-top:30px;padding-right:0px;padding-bottom:30px;padding-left:0px;border-top:0px solid transparent;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent">
                                                                                        <table style="border-spacing:0;border-collapse:collapse;vertical-align:top" cellpadding="0" cellspacing="0" width="100%">
                                                                                            <tbody>
                                                                                                <tr style="vertical-align:top">
                                                                                                    <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px">
                                                                                                        <div style="color:#555555;line-height:120%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif">
                                                                                                            <div style="font-size:12px;line-height:14px;text-align:center;color:#555555;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif">
                                                                                                                <p style="margin:0;font-size:12px;line-height:14px;text-align:center">© 2026 MKR Sports
                                                                                                                    <br>Legal Assistant for Kenyan Law
                                                                                                                    <br>
                                                                                                                </p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    
                                                                    
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <img src="https://ci3.googleusercontent.com/meips/ADKq_NZlz6qwvQn_WtBAvhYYYuiTPbsxgY5lsQvRTMWerNdRecR8KtfFAKyXY-B9mW3NSlCKN-hAhq5qRE66ZRE5UOadosWtjHwu2W9botzXyXDGSFQxtBf50lRPItqFjEl7ijQGfN7vnU8hiGRU=s0-d-e1-ft#https://mandrillapp.com/track/open.php?u=30661481&amp;id=da902d49576b4364846d8b939fcb1990" height="1" width="1" alt="" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0." x61dxqt41=""></div>`,
  });
};

export const sendMatchRegistrationEmail = async ({
  email,
  name,
  match,
}: {
  email: string;
  name?: string | null;
  match: {
    id: string;
    location: string;
    date: Date | string;
  };
}) => {
  const matchDate = new Date(match.date);

  const matchLink = `${process.env.NEXT_PUBLIC_BASE_URL}/matches/${match.id}`;

  await transporter.sendMail({
    from: `MKR Sports <${process.env.SMTP_USER}>`,
    to: email,
    subject: "✅ Match Registration Confirmed",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px">
        <h2 style="color:#111">You're In! ⚽</h2>

        <p>Hi ${name ?? "Player"},</p>

        <p>
          Your payment was successful and your slot for the match has been
          <strong>confirmed</strong>.
        </p>

        <hr style="margin:24px 0"/>

        <p><strong>📍 Venue:</strong> ${match.location}</p>
        <p><strong>📅 Date:</strong> ${matchDate.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}</p>
        <p><strong>⏰ Time:</strong> ${matchDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}</p>

        <div style="margin:32px 0">
          <a href="${matchLink}"
            style="
              background:#facc15;
              color:#111;
              padding:12px 18px;
              border-radius:6px;
              font-weight:bold;
              text-decoration:none;
              display:inline-block;
            ">
            View Match Details
          </a>
        </div>

        <p style="font-size:13px;color:#666">
          If you have any questions, reply to this email.
        </p>

        <p style="font-size:12px;color:#999;margin-top:40px">
          © ${new Date().getFullYear()} MKR Sports
        </p>
      </div>
    `,
  });
};
