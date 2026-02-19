import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// CREATE a deck
router.post("/", async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Deck title required" });
  }
  if (!description) {
    return res.status(400).json({ error: "Deck description required" });
  }

  const deck = await prisma.deck.create({
    data: { title, description },
  });

  res.status(201).json(deck);
});

// READ all decks
router.get("/", async (_req, res) => {
  const decks = await prisma.deck.findMany({ orderBy: { createdAt: "desc" } });

  res.json(decks);
});

// READ a deck
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const deck = await prisma.deck.findUnique({
    where: { id },
    include: { cards: true },
  });

  if (!deck) {
    return res.status(404).json({ error: "Deck not found" });
  }

  res.json(deck);
});

// UPDATE a deck
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Deck title required" });
  }

  const deck = await prisma.deck.update({
    where: { id },
    data: { title },
  });

  res.json(deck);
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
  } catch (error) {
    res.status(404).json({ error: "Deck not found" });
  }
});

export default router;
