import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- TRANSPORTER ---------------- */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/* ---------------- TEMPLATE RENDER ---------------- */

const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, unknown>
): Promise<string> => {
  const templatePath = path.resolve(
    process.cwd(),
    "src/utils/email-template",
    `${templateName}.ejs`
  );
  
  return ejs.renderFile(templatePath, data);
};

/* ---------------- SEND EMAIL ---------------- */

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, unknown>
): Promise<boolean> => {
  try {
    const html = await renderEmailTemplate(templateName, data);

    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", {
      to,
      subject,
      messageId: info.messageId,
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
