import express, { Application, Request, Response } from "express";
import knex from "./config/knex";

const app: Application = express();
const port = 4001;

// Hash function 
async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);                    

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string                  
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

app.use(express.json());

//just example request
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//just example request
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, pass, profile_picture } = req.body;

    // Encrypting Password
    const password = sha256(pass);

    const [userId] = await knex("user").insert({
      first_name,
      last_name,
      email,
      password,
      profile_picture
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
    const users = await knex.select("*").from("user");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
