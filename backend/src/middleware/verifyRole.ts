import { Request, Response, NextFunction } from "express";

interface RoleRequest extends Request {
  role?: string;
}

const verifyRoles = (...allowedRoles: string[]) => {
  return (req: RoleRequest, res: Response, next: NextFunction) => {
    if (!req.role) return res.sendStatus(401);

    const isAllowed = allowedRoles.includes(req.role);
    if (!isAllowed) return res.sendStatus(401);

    next();
  };
};

export default verifyRoles;
