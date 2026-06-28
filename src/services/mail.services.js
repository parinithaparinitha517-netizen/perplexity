import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;
const refreshToken = process.env.REFRESHTOKEN;
const user = process.env.USER;

console.log("========== MAIL CONFIG ==========");
console.log("USER:", user);
console.log("CLIENTID:", clientId ? "Loaded ✅" : "Missing ❌");
console.log("CLIENTSECRET:", clientSecret ? "Loaded ✅" : "Missing ❌");
console.log("REFRESHTOKEN:", refreshToken ? "Loaded ✅" : "Missing ❌");
console.log("=================================");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user,
        clientId,
        clientSecret,
        refreshToken,
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