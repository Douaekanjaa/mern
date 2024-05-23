import express from "express";
import { login, logout, signup, proSignup, proLogin, proLogout } from "../controllers/auth.controller.js";


const router = express.Router();

// Regular user signup/login routes
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);


// Pro signup/login routes
router.post("/pro/signup", proSignup);
router.post("/pro/login", proLogin);
router.post("/pro/logout", proLogout);




export default router;
