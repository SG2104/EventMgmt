// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { NODE_ENV } from "../../config";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Log the error stack
  res.status(500).json({
    message: "An error occurred",
    error: NODE_ENV === "development" ? err : {}, // Show error details only in development
  });
};

export default errorHandler;
