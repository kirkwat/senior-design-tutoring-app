import allowedOrigins from "./allowedOrigins";

import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (
      (typeof origin === "string" && allowedOrigins.indexOf(origin) !== -1) ||
      origin === undefined
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
