import bcrypt from 'bcrypt';
import passport from 'passport';
import { Router } from 'express';
import User from '../models/User.js';
import createHttpError from 'http-errors';
import { generateJWT } from '../helpers/jwt.js';
import authentication from '../middlewares/authentication.js';



const router = Router();

// REGISTRAZIONE
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(createHttpError.Conflict('Email già registrata'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.status(201).send({ message: 'Utente registrato con successo' });
  } catch (error) {
    next(error);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) return next(createHttpError.Unauthorized('Credenziali non valide'));

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return next(createHttpError.Unauthorized('Credenziali non valide'));

    const token = await generateJWT({ userId: user._id });

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

// 👉 INFO UTENTE LOGGATO
router.get('/me', authentication, async (req, res, next) => {
  try {
    const user = await User.findById(req.authUser.userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/login-google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, data) => {
    if (err || !data) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const { jwt } = data;

    return res.redirect(`${process.env.FRONTEND_URL}/login?token=${jwt}`);

    return res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  })(req, res, next);
});

router.get('/me', authentication, (request, response, next) => {
  response.send(request.authUser);
});

export default router;
