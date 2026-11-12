import bcrypt from "bcrypt";
import passport from "passport";
import { Router } from "express";
import User from "../models/User.js";
import UserModel from "../models/User.js";
import createHttpError from "http-errors";
import { generateJWT } from "../helpers/jwt.js";
import authentication from "../middlewares/authentication.js";
import { createRateLimiter } from "../middlewares/rateLimit.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const loginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });
const registerLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 10 });

router.post("/register", registerLimiter, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return next(createHttpError(400, "Tutti i campi sono obbligatori"));
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(createHttpError(409, "Email già registrata"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Registrazione manuale: sempre "user". L'email non è verificata, quindi
    // i privilegi admin si ottengono solo via Google (vedi passport.config.js).
    newUser.role = "user";

    await newUser.save();

    res.status(201).json({ message: "Utente registrato con successo" });
  } catch (error) {
    next(error);
  }
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return next(createHttpError.BadRequest('Email e password obbligatorie'));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    // gli utenti Google non hanno password: stesso errore generico
    if (!user || !user.password) return next(createHttpError.Unauthorized('Credenziali non valide'));

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return next(createHttpError.Unauthorized('Credenziali non valide'));

    const token = await generateJWT({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    res.send({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authentication, async (req, res, next) => {
  try {
    const user = req.user; 
    if (!user) {
      return res.status(401).json({ message: "Token non valido" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/login-google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, data) => {
    if (err || !data) {
      return res.redirect(`${process.env.FRONTEND_HOST}/login?error=oauth_failed`);
    }

    const { jwt } = data;
    // Il token va nel fragment (#): non viene inviato a server né in Referer
    return res.redirect(`${process.env.FRONTEND_HOST}/login#token=${jwt}`);
  })(req, res, next);
});

export default router;