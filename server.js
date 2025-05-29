// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");


const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const DB_FILE = "products.json";

// Load existing data or start fresh
function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    return JSON.parse(fs.readFileSync(DB_FILE));
  }
  return [];
}

// Save new product data
app.post("/save-product", (req, res) => {
  const product = req.body;
  const db = loadDB();
  db.push(product);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  res.json({ success: true, message: "Product saved locally!" });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
