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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: "Email non valida" });
  }

  // Destinatario dei messaggi: CONTACT_TO_EMAIL se presente, altrimenti CONTACT_EMAIL
  const to = process.env.CONTACT_TO_EMAIL || process.env.CONTACT_EMAIL;
  if (!to) {
    console.error("Né CONTACT_TO_EMAIL né CONTACT_EMAIL sono configurate");
    return res.status(500).json({ error: "Servizio contatti non configurato" });
  }

  try {
    // Mittente: un indirizzo del dominio verificato su Resend (CONTACT_FROM_EMAIL).
    // Senza, si usa il mittente di prova di Resend, che consegna solo al proprietario dell'account.
    const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

    const { error } = await resend.emails.send({
      from: `Eat&Go <${from}>`,
      to,
      replyTo: email,
      subject: `Nuovo messaggio da ${firstName} ${lastName}`.replace(/[\r\n]+/g, " "),
      text: `Email: ${email}\n\nMessaggio:\n${message}`,
    });

    // Il client Resend non lancia eccezioni: restituisce { error }
    if (error) throw new Error(error.message);

    res.json({ success: true });
  } catch (error) {
    console.error("Errore invio email:", error.message);
    res.status(500).json({ error: "Errore durante l'invio dell'email" });
  }
});

export default router;
