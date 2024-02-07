import express from "express";
import { login, register, refreshToken, logout } from "../Controller/auth.controller.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/refreshToken", refreshToken);
router.delete("/logout", logout);
export default router;
