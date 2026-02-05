import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// CREATE a card
router.post("/decks/:deckId/cards", async (req, res) => {
  const deckId = Number(req.params.deckId);
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer required" });
  }

  const card = await prisma.card.create({
    data: {
      question,
      answer,
      deckId,
    },
  });

  res.status(201).json(card);
});

// READ cards
router.get("/decks/:deckId/cards", async (req, res) => {
  const deckId = Number(req.params.deckId);

  const cards = await prisma.card.findMany({
    where: { deckId },
    orderBy: { createdAt: "desc" },
  });

  res.json(cards);
});

// UPDATE a card
router.put("/cards/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer required" });
  }

  const card = await prisma.card.update({
    where: { id },
    data: { question, answer },
  });

  res.json(card);
});

// DELETE a card
router.delete("/cards/:id", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.card.delete({
    where: { id },
  });

  res.status(204).send();
});

export default router;
