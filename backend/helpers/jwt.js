import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

console.log("[JWT DEBUG] JWT_SECRET:", process.env.JWT_SECRET ? "✅ caricato" : "❌ mancante");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

export const generateJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};

export const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};
