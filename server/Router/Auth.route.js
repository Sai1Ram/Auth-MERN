import express from "express";
import { login, register } from "../Controller/auth.controller.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", (req, resp, next) => {});
export default router;
