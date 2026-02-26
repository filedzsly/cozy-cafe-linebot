require("dotenv").config();
const express = require("express");

// ---------------------- PRODUCT DATA -------------------------
const fs = require("fs");

let products = {};

try {
  const raw = fs.readFileSync("./products.json", "utf8");
  products = JSON.parse(raw);
  console.log(`Loaded products.json (${Object.keys(products).length} items)`);
} catch (err) {
  console.error("Failed to load products.json:", err.message);
  products = {};
}
// -------------------------------------------------------------

// ---------------- TEST MODE ----------------
if (process.argv.includes("--test")) {
  console.log("=== TEST PRODUCT DATA (en) ===");

  for (const key in products) {
    const p = products[key];

    console.log("key:", key);
    console.log("Name:", p.name);
    console.log("Price:", `${p.price} THB`);
    console.log("Category:", p.category);
    console.log("Detail:", p.detail);
    console.log("img:", p.img);
    console.log("----------------------");
  }

  process.exit(0);
}

// Check token
if (!process.env.LINE_TOKEN || !process.env.LINE_SECRET) {
  console.error("Missing LINE_TOKEN or LINE_SECRET. Create .env first.");
  process.exit(1);
}

// Create linebot clients
const { Client, middleware } = require("@line/bot-sdk");

const config = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET,
};

const app = express();
const lineClient = new Client(config);

app.post("/webhook", middleware(config), async (req, res) => {
  const events = req.body.events;
  const results = await Promise.all(events.map(handleEvent));
  res.json(results);
});

function buildMenuText(products) {
  const catTitle = {
    coffee: "☕ Coffee",
    signature: "⭐ Signature",
    matcha: "🍵 Matcha",
    dessert: "🍰 Dessert Drink",
    other: "🥤 Other",
  };

  const groups = {};
  for (const key of Object.keys(products)) {
    const p = products[key];
    const cat = p.category || "other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push({ key, ...p });
  }

  for (const cat of Object.keys(groups)) {
    groups[cat].sort((a, b) => (a.name || "").localeCompare(b.name || "", "en"));
  }

  const order = ["coffee", "signature", "matcha", "dessert", "other"];
  const lines = [];

  lines.push("Please choose from the menu below:");

  for (const cat of order) {
    if (!groups[cat] || groups[cat].length === 0) continue;

    lines.push("");
    lines.push(catTitle[cat] || cat);

    let i = 1;
    for (const p of groups[cat]) {
      const name = p.name || p.key;
      const price = p.price != null ? `${p.price}` : "";
      lines.push(`${i}. ${name} — ${price} THB`);
      i++;
    }
  }

  lines.push("");
  lines.push("Type the menu name (EN) or key (e.g. matcha_latte).");

  return lines.join("\n");
}

// ---------------------- ANTI SPAM ----------------------
const rateStore = new Map();
const WINDOW_MS = 10 * 1000;
const MAX_REQ_PER_WINDOW = 6;

function isSpamming(userId) {
  const now = Date.now();
  const rec = rateStore.get(userId) || { start: now, count: 0 };

  if (now - rec.start > WINDOW_MS) {
    rec.start = now;
    rec.count = 0;
  }

  rec.count += 1;
  rateStore.set(userId, rec);

  return rec.count > MAX_REQ_PER_WINDOW;
}
// --------------------------------------------------------

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") return null;

  const userId = event.source?.userId || "unknown";
  if (userId !== "unknown" && isSpamming(userId)) {
    return lineClient.replyMessage(event.replyToken, {
      type: "text",
      text: "You're sending messages too fast 😅 Please wait a moment and try again.",
    });
  }

  const text = event.message.text.trim();
  const lower = text.toLowerCase();

  if (["menu", "list", "products"].includes(lower)) {
    return lineClient.replyMessage(event.replyToken, {
      type: "text",
      text: buildMenuText(products),
    });
  }

  let found = null;

  for (const key in products) {
    const p = products[key];
    if (lower === key.toLowerCase() || lower === (p.name || "").toLowerCase()) {
      found = p;
      found._key = key;
      break;
    }
  }

  if (found) {
    const p = found;

    const messages = [
      {
        type: "text",
        text: `Product: ${p.name || p._key}\nPrice: ${p.price} THB\nDetail: ${p.detail || "-"}`,
      },
    ];

    if (p.img) {
      messages.push({
        type: "image",
        originalContentUrl: p.img,
        previewImageUrl: p.img,
      });
    }

    return lineClient.replyMessage(event.replyToken, messages);
  }

  return lineClient.replyMessage(event.replyToken, {
    type: "text",
    text: `I couldn't find that 😊 Type "menu" to see all items.`,
  });
}

app.listen(3000, () => console.log("LINE Bot running on port 3000"));