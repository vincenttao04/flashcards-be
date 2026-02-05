import express from "express";
import prisma from "./prisma";
import debugRouter from "./routes/debug";
import deckRouter from "./routes/decks";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/test-db", async (_req, res) => {
  const cards = await prisma.flashcard.findMany();
  res.json(cards);
});

app.use("/debug", debugRouter);

app.use("/decks", deckRouter);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
