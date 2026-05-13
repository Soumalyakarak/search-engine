import express, {Router} from "express";
import { loginUser, resetUserPassword, userForgotPassword, userRegistration, verifyUser,refreshToken, getUser, verifyUserForgotPassword, logoutUser} from "@/controllers/auth.controller.js";
import isAuthenticated from "@/middlewares/isAuthenticated.js";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token", refreshToken);
router.get("/logged-in-user", isAuthenticated, getUser);
router.post("/forgot-password-user", userForgotPassword);
router.post("/reset-password-user", resetUserPassword);
router.post("/verify-forgot-password-user", verifyUserForgotPassword);
router.post("/logout-user", logoutUser);










export default router;