// src/types/express/index.d.ts
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "email" | "name">;
    }
  }
}

export {}; // 👈 necessary to mark this as a module
