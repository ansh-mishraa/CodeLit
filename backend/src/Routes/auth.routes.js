import express from "express";
import { check, getProfile, login, logout, register, userVerify } from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();


authRoutes.post("/register", register)
authRoutes.post("/login", login)
authRoutes.get("/verify/:token", userVerify)
authRoutes.get("/get-profile",isLoggedIn, getProfile)
authRoutes.post("/logout", isLoggedIn, logout)
authRoutes.get("/check", isLoggedIn, check)


export default authRoutes