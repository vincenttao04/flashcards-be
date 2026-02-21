import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// CREATE a deck
router.post("/", async (req, res) => {
  const { title, description, cards } = req.body;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    !Array.isArray(cards)
  ) {
    return res.status(400).json({ error: "Invalid input format" });
  }

  const cleanTitle = title.trim();
  const cleanDescription = description.trim();

  if (!cleanTitle || !cleanDescription) {
    return res.status(400).json({ error: "Deck title/description required" });
  }

  if (cards.length === 0) {
    return res.status(400).json({ error: "At least one card is required" });
  }

  const cleanCards = [];
  for (const card of cards) {
    if (
      typeof card !== "object" ||
      card === null ||
      typeof card.question !== "string" ||
      typeof card.answer !== "string"
    ) {
      return res.status(400).json({ error: "Invalid card format" });
    }

    const question = card.question.trim();
    const answer = card.answer.trim();

    if (!question || !answer) {
      return res.status(400).json({ error: "Card question/answer required" });
    }

    cleanCards.push({ question, answer });
  }

  try {
    const deck = await prisma.deck.create({
      data: {
        title: cleanTitle,
        description: cleanDescription,
        cards: {
          create: cleanCards,
        },
      },
      include: { cards: true },
    });

    res.status(201).json(deck);
  } catch (error) {
    res.status(500).json({ error: "Failed to create deck" });
  }
});

// READ all decks
router.get("/", async (_req, res) => {
  try {
    const decks = await prisma.deck.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(decks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch decks" });
  }
});

// READ a deck
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid deck ID" });
  }

  try {
    const deck = await prisma.deck.findUnique({
      where: { id },
      include: { cards: true },
    });

    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    res.json(deck);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deck" });
  }
});

// UPDATE a deck
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, description } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid deck ID" });
  }

  if (typeof title !== "string" || typeof description !== "string") {
    return res
      .status(400)
      .json({ error: "Deck title/description invalid format" });
  }

  const cleanTitle = title.trim();
  const cleanDescription = description.trim();

  if (!cleanTitle || !cleanDescription) {
    return res.status(400).json({ error: "Deck title/description required" });
  }

  try {
    const deck = await prisma.deck.update({
      where: { id },
      data: { title: cleanTitle, description: cleanDescription },
    });

    res.json(deck);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Deck not found" });
    }

    res.status(500).json({ error: "Failed to update deck" });
  }
});

// DELETE a deck
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid deck ID" });
  }

  try {
    await prisma.deck.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Deck not found" });
    }

    res.status(500).json({ error: "Failed to delete deck" });
  }
});

export default router;
