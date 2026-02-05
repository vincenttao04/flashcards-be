import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// CREATE a deck
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Deck name required" });
  }

  const deck = await prisma.deck.create({
    data: { name },
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
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Deck name required" });
  }

  const deck = await prisma.deck.update({
    where: { id },
    data: { name },
  });

  res.json(deck);
});

// DELETE a deck
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.deck.delete({
    where: { id },
  });

  res.status(204).send();
});

export default router;
