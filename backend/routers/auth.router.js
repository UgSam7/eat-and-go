import bcrypt from "bcrypt";
import passport from "passport";
import { Router } from "express";
import User from "../models/User.js";
import UserModel from "../models/User.js";
import createHttpError from "http-errors";
import { generateJWT } from "../helpers/jwt.js";
import authentication from "../middlewares/authentication.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

router.post("/register", async (req, res, next) => {
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

    if (newUser.email === SUPER_ADMIN_EMAIL) {
      newUser.role = "superadmin";
    } else if (ADMIN_EMAILS.includes(newUser.email)) {
      newUser.role = "admin";
    } else {
      newUser.role = "user";
    }

    await newUser.save();

    res.status(201).json({ message: "Utente registrato con successo" });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return next(createHttpError.Unauthorized('Credenziali non valide'));

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
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const { jwt } = data;
    return res.redirect(`${process.env.FRONTEND_URL}/login?token=${jwt}`);
  })(req, res, next);
});

export default router;