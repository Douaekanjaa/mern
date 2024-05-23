import express from "express";
import { login, logout, register } from "../controllers/admin.controller.js";
import { protectAdminRoute } from "../middleware/protectAdminRoute.js";
const router = express.Router();

router.post("/login", login);
router.post("/logout", protectAdminRoute, logout);

router.post("/register", register);

export default router;
