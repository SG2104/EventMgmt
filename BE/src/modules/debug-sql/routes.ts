import { Router } from "express";
import { prisma } from "../../db";

const router = Router();

router.get("/sql-demo", async (req, res) => {
  const { email } = req.query;

  try {
    //insecure
    const result = await prisma.$queryRawUnsafe(
      `SELECT * FROM "User" WHERE email = '${email}'`
    );

    //secure
    // const result = await prisma.$queryRaw`
    //   SELECT * FROM "User" WHERE email = ${email}
    // `;

    res.json({
      success: true,
      data: result,
      message: "SQL Query Result",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error running SQL query",
      error,
    });
  }
});

export const debugRouter = router;
