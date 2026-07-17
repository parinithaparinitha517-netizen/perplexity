import { Router } from "express";

const authRoutes = Router();
import { registerUser, loginUser, logoutUser, verifyemail, getUser } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/express.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";
authRoutes.post("/register", registerValidator, registerUser);
authRoutes.post("/login", loginValidator, loginUser);
authRoutes.post("/logout", logoutUser);
authRoutes.get("/verify-email", verifyemail);
authRoutes.get('/get-me', authUser, getUser)
authRoutes.get('/getme', authUser, getUser)

export default authRoutes;
