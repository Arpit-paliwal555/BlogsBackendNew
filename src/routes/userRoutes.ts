import { Router } from "express";
import {  getUsers } from "../controller/userController";
import {login, logout, signup } from "../controller/authController";
const router = Router();

router.post("/signup", signup);
router.post("/signin", login);
router.post("/logout", logout);
router.get("/", getUsers);
export default router;