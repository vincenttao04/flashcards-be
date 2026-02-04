import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/test-db", (_req, res) => {
  
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
