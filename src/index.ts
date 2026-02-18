import cors from "cors";
import express from "express";
import prisma from "./prisma";
import debugRouter from "./routes/debug";
import decksRouter from "./routes/decks";
import cardsRouter from "./routes/cards";

const app = express();

app.use(cors());
app.use(express.json());

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
