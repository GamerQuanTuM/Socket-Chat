import express from "express";
import { uploadSingle } from "../middleware/multer";
import { login, logout, register } from "../controllers/auth.controller";

const router = express.Router()

router.post("/register", uploadSingle, register)
router.post("/login", login);
router.get("/logout", logout);

export default router

