import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// 👇 Change this to your Google Apps Script URL (ending in /exec)
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbxTSX-oYbq0HdP8i_Rmb31AyICVqj79AfS5GIwiRRit-e6SwV0nKtA6ms7wmQw0HiAnOQ/exec";

app.get("/", async (req, res) => {
  const { temperature, humidity } = req.query;

  if (!temperature || !humidity) {
    return res.status(400).send("Missing parameters");
  }

  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?temperature=${temperature}&humidity=${humidity}`);
    const text = await response.text();
    res.send(text);
  } catch (e) {
    res.status(500).send(`Error: ${e.message}`);
  }
});

app.listen(PORT, () => console.log(`Bridge running on port ${PORT}`));
