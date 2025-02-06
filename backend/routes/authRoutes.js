import express from "express";

//controllers
import { signup, login, logout } from "../controllers/authController.js";

import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protectRoute, async (req, res) => { });

export default router;