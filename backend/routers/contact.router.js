import express from "express";
import { Resend } from "resend";
import { createRateLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const contactLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

const isText = (v, max) => typeof v === "string" && v.trim() && v.length <= max;

router.post("/", contactLimiter, async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if (!isText(firstName, 100) || !isText(lastName, 100) || !isText(email, 200) || !isText(message, 5000)) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    console.error("CONTACT_TO_EMAIL non configurata");
    return res.status(500).json({ error: "Servizio contatti non configurato" });
  }

  try {
    await resend.emails.send({
      from: "Eat&Go <onboarding@resend.dev>",
      to,
      subject: `Nuovo messaggio da ${firstName} ${lastName}`.replace(/[\r\n]+/g, " "),
      text: `Email: ${email}\n\nMessaggio:\n${message}`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Errore invio email:", error.message);
    res.status(500).json({ error: "Errore durante l'invio dell'email" });
  }
});

export default router;
