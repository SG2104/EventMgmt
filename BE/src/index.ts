import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorHandler from "./modules/middlewares/errorHandle";
import { FRONTEND_URL, PORT } from "./config";
import { checkDatabaseConnection } from "./db";
import { registerModules } from "./modules";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true,
  })
);
app.use(morgan("dev"));

registerModules(app);

app.use(errorHandler);

app.listen(PORT, () => console.warn(`Server is running on port ${PORT}`));

checkDatabaseConnection();
