import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const loginSchema = z.object({
  user: z.string().min(1, "Email is required."),
  pwd: z.string().min(1, "Password is required."),
});

const handleLogin = async (req: Request, res: Response) => {
  try {
    const { user, pwd } = loginSchema.parse(req.body);

    const foundUser = await User.findUserByEmail(user);
    if (!foundUser) return res.sendStatus(401);

    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("Environment variables not set");
    }

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
      const accessToken = jwt.sign(
        { email: foundUser.email, role: foundUser.role, id: foundUser.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );
      const refreshToken = jwt.sign(
        { email: foundUser.email, role: foundUser.role, id: foundUser.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "2d" },
      );

      await User.updateUserRefreshToken(foundUser.email, refreshToken);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ role: foundUser.role, accessToken, id: foundUser.id });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: err.errors.map((e) => e.message).join(", ") });
    } else if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export { handleLogin };
