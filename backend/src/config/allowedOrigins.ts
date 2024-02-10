import dotenv from "dotenv";
dotenv.config();

const allowedOrigins: string[] = [process.env.CLIENT_URL || ""].filter(Boolean);

export default allowedOrigins;
