import { Router } from "express";
import {  getUsers } from "../controller/userController";
import {getUser, login, logout, signup } from "../controller/authController";
import { authMiddleware } from "../middleware/auth";
const router = Router();

router.post("/signup", signup);
router.post("/signin", login);
router.post("/logout", logout);
router.get("/me",authMiddleware, getUser);
router.get("/", getUsers);
export default router;