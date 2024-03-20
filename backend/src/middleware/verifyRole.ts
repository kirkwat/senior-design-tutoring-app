import { Request, Response, NextFunction } from "express";
import { Role } from "../config/roles";

interface RoleRequest extends Request {
  role?: Role;
}

const verifyRoles = (...allowedRoles: Role[]) => {
  return (req: RoleRequest, res: Response, next: NextFunction) => {
    if (!req.role) return res.sendStatus(401);

    const isAllowed = allowedRoles.includes(req.role);
    if (!isAllowed) return res.sendStatus(401);

    next();
  };
};

export default verifyRoles;
