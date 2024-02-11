import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findUserByRefreshToken(refreshToken);
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    //! FIX THIS
    (err: any, decoded: any) => {
      if (err || foundUser.username !== decoded.username)
        return res.sendStatus(403);
      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "30s" },
      );
      res.json({ accessToken });
    },
  );
};

export { handleRefreshToken };
