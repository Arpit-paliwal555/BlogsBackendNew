import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

const SECRET = process.env.SECRET || "default_secret";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };
  console.log("REQ BODY:", req.body);
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  // add zod validation here
  const user = await prisma.user.findFirst({
    where: { email },
    include: {
      blogPosts: true,
      imagePosts: true,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch =  await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.json({ message: "Login successful" });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.json({ message: "Logout successful" });
}

export async function signup(req: Request, res: Response) {
  const { username, email, password } = req.body as {
    username?: string;
    email?: string;
    password?: string;
  };
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email and password are required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const created = await prisma.user.create({
      data: { username, email, password: hashedPassword },
      include: {
        blogPosts: true,
        imagePosts: true,
      },
    });
    const token = jwt.sign({ userId: created.id }, SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
  });
    return res.status(200).json(created);
  } catch (err) {
    //Handle unique constraint errors (P2002)
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const target = (err.meta?.target as string[])?.join(", ") || "field(s)";
      return res.status(409).json({
        message: `A user with the same ${target} already exists.`,
      });
    }
  }
}

export async function getUser(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: {
      blogPosts: true,
      imagePosts: true,
    },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}