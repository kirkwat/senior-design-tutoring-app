import express, { Request, Response } from "express";
import dotenv from "dotenv";

import { logger } from "./middleware/logEvents";
import cors from "cors";
import credentials from "./middleware/credentials";
import corsOptions from "./config/corsOptions";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";

import authRoute from "./routes/auth";
import logoutRoute from "./routes/logout";
import refreshRoute from "./routes/refresh";
import registerRoute from "./routes/register";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(logger);
app.use(errorHandler);
app.use(express.json());
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));

app.use("/auth", authRoute);
app.use("/logout", logoutRoute);
app.use("/refresh", refreshRoute);
app.use("/register", registerRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});
