import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const user = process.env.USER;
const appPassword = process.env.MAIL_PASSWORD?.replace(/\s/g, "");

if (!user || !appPassword) {
    throw new Error("USER and MAIL_PASSWORD must be configured for email delivery");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user,
        pass: appPassword,
    },
});

async function verifyTransporter() {
    try {
        console.log("🔍 Verifying SMTP transporter...");
        await transporter.verify();
        console.log("✅ SMTP Server is ready");
    } catch (err) {
        console.error("❌ SMTP Verify Error:");
        console.error(err);
    }
}

verifyTransporter();

export async function sendMail({ to, subject, html, text }) {
    console.log("\n==============================");
    console.log("📤 sendMail() called");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("==============================");

    try {
        const info = await transporter.sendMail({
            from: user,
            to,
            subject,
            html,
            text,
        });

        console.log("✅ EMAIL SENT SUCCESSFULLY");
        console.log(info);

        return info;
    } catch (err) {
        console.log("❌ SEND MAIL FAILED");
        console.error(err);

        throw err;
    }
}
