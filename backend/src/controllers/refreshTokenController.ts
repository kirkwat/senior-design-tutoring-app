import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

interface CustomJwtPayload extends JwtPayload {
  email: string;
  role: string;
}

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findUserByRefreshToken(refreshToken);
  if (!foundUser) return res.sendStatus(403);

  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Environment variables not set");
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: any, decoded: any) => {
      if (err || !decoded) return res.sendStatus(403);

      const typedDecoded = decoded as CustomJwtPayload;

      if (err || foundUser.email !== typedDecoded.email)
        return res.sendStatus(403);

      const accessToken = jwt.sign(
        { email: typedDecoded.email, role: typedDecoded.role },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" },
      );
      res.json({ accessToken });
    },
  );
};

export { handleRefreshToken };
