import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !lastName || !email || !message)
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Eat&Go - Contatto" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `Nuovo messaggio da ${firstName} ${lastName}`,
      text: `Email: ${email}\n\nMessaggio:\n${message}`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Errore invio email:", error);
    res.status(500).json({ error: "Errore durante l'invio dell'email" });
  }
});

export default router;