import express, { Application, Request, Response } from "express";
import knex from "./config/knex";

const app: Application = express();
const port = 3000;

app.use(express.json());

//just example request
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

//just example request
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const [userId] = await knex("users").insert({
      name,
      email,
    });

    res.status(201).json({
      id: userId,
      message: "User created",
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Error adding user");
  }
});

//just example request
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await knex.select("*").from("users");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
