import express from "express";
import prisma from "./prisma";
import debugRouter from "./routes/debug";
import decksRouter from "./routes/decks";
import cardsRouter from "./routes/cards";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// app.get("/test-db", async (_req, res) => {
//   const cards = await prisma.flashcard.findMany();
//   res.json(cards);
// });

app.use("/debug", debugRouter);

app.use("/decks", decksRouter);

app.use("/", cardsRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
