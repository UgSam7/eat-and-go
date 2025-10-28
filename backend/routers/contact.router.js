import express from "express";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  console.log("📩 Richiesta ricevuta su /api/contact:", req.body); // <--- aggiungilo qui

  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !lastName || !email || !message)
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });

  try {
    const data = await resend.emails.send({
      from: "Eat&Go <onboarding@resend.dev>",
      to: "eatandgo.contact@gmail.com",
      subject: `Nuovo messaggio da ${firstName} ${lastName}`,
      text: `Email: ${email}\n\nMessaggio:\n${message}`,
    });

    console.log("📨 Email inviata:", data); // <--- e questo
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Errore invio email:", error);
    res.status(500).json({ error: "Errore durante l'invio dell'email" });
  }
});

export default router;