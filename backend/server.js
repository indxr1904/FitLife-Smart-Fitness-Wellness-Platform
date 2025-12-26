const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const progressRoutes = require("./routes/progressRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const dietRoutes = require("./routes/dietRoutes");
const planRoutes = require("./routes/planRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("Server is live!");
});

app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);

// contact api
app.use("/api", contactRoutes);

// Admin Routes
app.use("/api/users/profile", adminRoutes);

// Admin Page Routes
app.use("/api/admin/exercise", exerciseRoutes);
app.use("/api/admin/diet", dietRoutes);
app.use("/api/admin/plan", planRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
