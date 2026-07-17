import userModel from "../models/user.model.js";
import { sendMail } from "../services/mail.services.js";
import jwt from "jsonwebtoken";

const getFrontendUrl = () => (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
const getBackendUrl = () => (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");

function redirectToLogin(res, verification) {
    return res.redirect(`${getFrontendUrl()}/login?verification=${verification}`);
}

export async function registerUser(req, res, next) {
    try {
        const username = req.body.username.trim();
        const email = req.body.email.trim().toLowerCase();
        const { password } = req.body;
        const isProduction = process.env.NODE_ENV === "production";

        const userAlreadyExists = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (userAlreadyExists) {
            if (!isProduction && !userAlreadyExists.verified && userAlreadyExists.email === email) {
                const token = jwt.sign(
                    { _id: userAlreadyExists.id, email: userAlreadyExists.email },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );

                return res.status(200).json({
                    success: true,
                    message: "Account exists but still needs verification.",
                    verificationLink: `${getBackendUrl()}/auth/api/verify-email?token=${token}`,
                });
            }

            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const user = await userModel.create({
            username,
            email,
            password,
        });

       const token = jwt.sign(
    {
        _id: user.id,
        email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);

        const verificationLink = `${getBackendUrl()}/auth/api/verify-email?token=${token}`;

        const html = `
            <h2>Verify Your Email</h2>

            <p>Click the link below to verify your email:</p>

            <a href="${verificationLink}">Verify Email</a>

            <p>If the link doesn't work, copy and paste this into your browser:</p>

            <p>${verificationLink}</p>
        `;

        let emailSent = true;

        try {
            await sendMail({
                to: email,
                subject: "Verify Your Email",
                html,
            });
        } catch (mailError) {
            if (isProduction) {
                await userModel.findByIdAndDelete(user._id);
                throw mailError;
            }

            emailSent = false;
            console.warn("Email delivery failed; returning a local verification link.");
        }

        const { password: _, ...safeUser } = user.toObject();

        return res.status(201).json({
            success: true,
            message: emailSent
                ? "User registered successfully. Please verify your email."
                : "User registered. Use the local verification link to continue.",
            data: safeUser,
            ...(!emailSent && { verificationLink }),
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
}
export async function verifyemail(req, res) {
    try {
        const { token } = req.query;

        if (!token) {
            return redirectToLogin(res, "missing");
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return redirectToLogin(res, "invalid");
        }

        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return redirectToLogin(res, "not-found");
        }

        if (!user.verified) {
            user.verified = true;
            await user.save();
        }

        return redirectToLogin(res, "success");
    } catch (err) {
        console.error('Verification error', err);
        return redirectToLogin(res, "error");
    }
}
export async function loginUser(req, res, next) {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({ email }).collation({
            locale: "en",
            strength: 2,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password. Register first if you do not have an account.",
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in",
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const { password: _, ...safeUser } = user.toObject();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: safeUser,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}
export async function getUser(req, res) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}
