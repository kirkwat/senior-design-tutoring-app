import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";
import { z } from "zod";

const newUserSchema = z.object({
  user: z.string(),
  pwd: z.string(),
  name: z.string(),
  role: z.enum(["user", "tutor"]),
});

const handleNewUser = async (req: Request, res: Response) => {
  try {
    const { user, pwd, name, role } = newUserSchema.parse(req.body);

    const duplicate = await User.findUserByEmail(user);
    if (duplicate) return res.sendStatus(409);

    const hashedPwd = await bcrypt.hash(pwd, 10);
    await User.createUser({
      email: user,
      password: hashedPwd,
      name,
      role,
    });

    res.status(201).json({ success: `New ${role} ${user} created!` });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors });
    } else if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export { handleNewUser };
