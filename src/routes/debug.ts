// src/routes/debug.ts
import prisma from "../prisma";
import { Router } from "express";

const router = Router();

router.get("/db", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ db: "connected" });
});

export default router;
