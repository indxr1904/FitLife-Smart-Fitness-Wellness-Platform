const express = require("express");
const Contact = require("./../models/Contact");

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = await Contact.create({
      name,
      email,
      message,
    });

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
