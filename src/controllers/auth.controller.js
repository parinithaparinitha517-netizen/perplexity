import userModel from "../models/user.model.js";
import { sendMail } from "../services/mail.services.js";
import jwt from "jsonwebtoken";

export async function registerUser(req, res, next) {
    try {
        const { username, email, password } = req.body;

        const userAlreadyExists = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (userAlreadyExists) {
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
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const verificationLink = `http://localhost:3000/auth/api/verify-email?token=${token}`;

        const html = `
            <h2>Verify Your Email</h2>

            <p>Click the link below to verify your email:</p>

            <a href="${verificationLink}">Verify Email</a>

            <p>If the link doesn't work, copy and paste this into your browser:</p>

            <p>${verificationLink}</p>
        `;

        await sendMail({
            to: email,
            subject: "Verify Your Email",
            html,
        });

        const { password: _, ...safeUser } = user.toObject();

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            data: safeUser,
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
            return res.status(400).send(`
                                <html>
                                    <body>
                                        <h1>Verification token missing</h1>
                                        <p>The verification link is missing the required token. Please use the full link provided in your email.</p>
                                    </body>
                                </html>
                        `);
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).send(`
                                <html>
                                    <body>
                                        <h1>Invalid or expired token</h1>
                                        <p>The verification link is invalid or has expired. Please request a new verification email.</p>
                                    </body>
                                </html>
                        `);
        }

        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).send(`
                                <html>
                                    <body>
                                        <h1>User not found</h1>
                                        <p>No account matches this verification link.</p>
                                    </body>
                                </html>
                        `);
        }

        user.verified = true;
        await user.save();

        return res.send(`
                        <html>
                            <body>
                                <h1>User verified successfully</h1>
                                <p>You can now continue to the login process.</p>
                            </body>
                        </html>
                `);
    } catch (err) {
        console.error('Verification error', err);
        return res.status(500).send(`
                        <html>
                            <body>
                                <h1>Server error</h1>
                                <p>Unable to verify your account right now. Please try again later.</p>
                            </body>
                        </html>
                `);
    }
}
export async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
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
