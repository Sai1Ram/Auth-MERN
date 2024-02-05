import express from "express";
import { register } from "../Controller/auth.controller.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", );
router.delete("/logout", (req, resp, next) => {});
export default router;
