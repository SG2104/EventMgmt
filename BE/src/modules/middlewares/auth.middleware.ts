/// <reference path="../../types/express/index.d.ts" />
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../db";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
 //secure (XSS attack)
  const token = req.cookies?.token;

  //insecure (XSS attack)
  // const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
