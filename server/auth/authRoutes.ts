import express from "express";
import { login } from "./authController.ts";

const router = express.Router();
router.post("/login", login);

export default router;