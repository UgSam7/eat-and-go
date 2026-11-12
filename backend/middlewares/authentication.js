import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authentication(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createHttpError.Unauthorized("Token mancante");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Cerca l’utente nel DB
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError.Unauthorized("Utente non trovato");
    }

    // Attacca l’utente a req
    req.user = user;

    next();
  } catch (error) {
    console.error("[AUTH ERROR]", error.message);
    next(createHttpError.Unauthorized("Token non valido o utente non trovato"));
  }
}