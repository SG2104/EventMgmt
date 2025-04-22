import { Request, Response } from "express";
import { registerUser, loginUser } from "./service";
import generalResponse from "../../utlis/generalResponse";
import jwt from "jsonwebtoken";
import { prisma } from "../../db";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    return generalResponse(
      res,
      201,
      user,
      "Registered successfully",
      true,
      true
    );
  } catch (err: any) {
    return generalResponse(res, 400, false, err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("🚀 Login controller hit");
  try {
    const { token, user } = await loginUser(req.body);

    //secure (token is never exposed to JS)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      //insecure (csrf attack)
      sameSite: "lax",

      //secure (csrf attack)
      // sameSite: "strict",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //secure (XSS attack)
    return generalResponse(res, 200, user, "Login successful", true, true);

    //insecure (XSS attack)
    // return generalResponse(res, 200, { token, user }, "Login successful", true, true);

  } catch (err: any) {
    return generalResponse(res, 400, false, err.message);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  return generalResponse(res, 200, true, "Logged out");
};

//secure (authentication bypass)
export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) throw new Error("User not found");

    return generalResponse(res, 200, user, "Authenticated", true, true);
  } catch (err: any) {
    return generalResponse(res, 401, false, err.message);
  }
};


//insecure (authentication bypass)
// export const getMe = async (req: Request, res: Response) => {
//   try {
//     const user = {
//       id: "attacker-id",
//       email: "attacker@example.com",
//       name: "Hacker",
//     };

//     return generalResponse(res, 200, user, "Authenticated (Insecure)", true, true);
//   } catch (err: any) {
//     return generalResponse(res, 401, false, err.message);
//   }
// };
