import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// CREATE a card
router.post("/decks/:deckId/cards", async (req, res) => {
  const deckId = Number(req.params.deckId);
  const { question, answer } = req.body;

  if (typeof question !== "string" || typeof answer !== "string") {
    return res.status(400).json({ error: "Invalid input format" });
  }

  const cleanQuestion = question.trim();
  const cleanAnswer = answer.trim();

  if (!cleanQuestion || !cleanAnswer) {
    return res.status(400).json({ error: "Question and answer required" });
  }

  try {
    const card = await prisma.card.create({
      data: {
        question: cleanQuestion,
        answer: cleanAnswer,
        deckId,
      },
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: "Failed to create card" });
  }
});

// READ cards
router.get("/decks/:deckId/cards", async (req, res) => {
  const deckId = Number(req.params.deckId);

  if (Number.isNaN(deckId)) {
    return res.status(400).json({ error: "Invalid deck ID" });
  }

  try {
    const cards = await prisma.card.findMany({
      where: { deckId },
      orderBy: { createdAt: "desc" },
    });

    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

// UPDATE a card
router.put("/cards/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { question, answer } = req.body;

  if (typeof question !== "string" || typeof answer !== "string") {
    return res.status(400).json({ error: "Invalid input format" });
  }

  const cleanQuestion = question.trim();
  const cleanAnswer = answer.trim();

  if (!cleanQuestion || !cleanAnswer) {
    return res.status(400).json({ error: "Question and answer required" });
  }

  try {
    const card = await prisma.card.update({
      where: { id },
      data: { question: cleanQuestion, answer: cleanAnswer },
    });

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: "Failed to update card" });
  }
});

// DELETE a card
router.delete("/cards/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid card ID" });
  }

  try {
    await prisma.card.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete card" });
  }
});

export default router;
