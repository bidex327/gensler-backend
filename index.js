const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const cardsRoutes = require("./routes/cards");
const { dbConnect } = require("./lib/dbConnect");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  try {
    await dbConnect();
    console.log("Database ready");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
})();
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://gensler-m53g.vercel.app",
     
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use("/api", userRoutes);
app.use("/api", cardsRoutes);

app.get("/api/cards", (req, res) => res.status(200).json(cards));
app.get("/", (req, res) => res.send("Welcome to my API"));

if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
