import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./modules/middlewares/errorHandle";
import { FRONTEND_URL, PORT } from "./config";
import { routes } from "./modules";
import { checkDatabaseConnection } from "./db";
const app = express();
app.use(express.json());
app.use(cors({ origin: [FRONTEND_URL] }));
app.use(morgan("dev"));
app.use(errorHandler); //
app.use("/api/v1", routes);
app.listen(PORT, () => console.warn(`Server is running on port ${PORT}`));
checkDatabaseConnection();
