// src/routes/debug.ts
import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/db", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ db: "connected" });
});

export default router;
