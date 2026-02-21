import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// CREATE a deck
router.post("/", async (req, res) => {
  const { rawTitle, rawDescription } = req.body;
  const title = rawTitle?.trim();
  const description = rawDescription?.trim();

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    !title.trim() ||
    !description.trim()
  ) {
    return res.status(400).json({ error: "Deck title/description required" });
  }

  try {
    const deck = await prisma.deck.create({
      data: { title, description },
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
  const { rawTitle, rawDescription } = req.body;
  const title = rawTitle?.trim();
  const description = rawDescription?.trim();

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid deck ID" });
  }

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    !title.trim() ||
    !description.trim()
  ) {
    return res.status(400).json({ error: "Deck title/description required" });
  }

  try {
    const deck = await prisma.deck.update({
      where: { id },
      data: { title, description },
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
