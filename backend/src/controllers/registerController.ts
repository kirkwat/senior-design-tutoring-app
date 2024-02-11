import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";

const handleNewUser = async (req: Request, res: Response) => {
  const { user, pwd, name } = req.body;
  if (!user || !pwd || !name)
    return res
      .status(400)
      .json({ message: "Username, password, and name are required." });

  const duplicate = await User.findUserByUsername(user);
  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    await User.createUser({ username: user, password: hashedPwd, name });

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export { handleNewUser };
