import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface JWTRequest extends Request {
  email?: string;
  role?: string;
}

interface CustomJwtPayload extends JwtPayload {
  email: string;
  role: string;
}

const verifyJWT = (req: JWTRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers["Authorization"];
  const token =
    typeof authHeader === "string" ? authHeader.split(" ")[1] : undefined;

  if (
    !token ||
    (typeof authHeader === "string" && !authHeader.startsWith("Bearer "))
  )
    return res.sendStatus(401);

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Environment variables not set");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const decodedPayload = decoded as CustomJwtPayload;

    if (decodedPayload) {
      req.email = decodedPayload.email;
      req.role = decodedPayload.role;
      next();
    } else {
      return res.sendStatus(403);
    }
  });
};

export default verifyJWT;
