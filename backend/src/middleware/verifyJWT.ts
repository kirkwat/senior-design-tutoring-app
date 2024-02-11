import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface RequestWithUser extends Request {
  user?: string | JwtPayload;
}

const verifyJWT = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Environment variables not set");
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = decoded;
    next();
  });
};

export default verifyJWT;
