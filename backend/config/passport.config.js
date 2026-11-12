import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateJWT } from '../helpers/jwt.js';
import User from '../models/User.js';
import { roleForEmail } from '../middlewares/authorization.js';

const strategyGoogle = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_HOST}${process.env.GOOGLE_CALLBACK_PATH}`,
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          firstName: profile._json.given_name || profile.displayName || "Utente",
          lastName: profile._json.family_name || "",
          email: profile._json.email,
          profile: profile._json.picture
            ? { path: profile._json.picture }
            : null,
          googleId: profile.id,
        });
      }

      // L'email Google è verificata: qui (e solo qui) si assegnano i ruoli admin da env.
      // Si promuove soltanto, non si declassa mai.
      if (profile._json.email_verified !== false) {
        const expectedRole = roleForEmail(user.email);
        if (expectedRole !== "user" && user.role !== expectedRole) {
          user.role = expectedRole;
          await user.save();
        }
      }

      
      const jwt = await generateJWT({ userId: user._id, email: user.email, role: user.role });

   
      return done(null, { jwt });
    } catch (error) {
      console.error("Errore strategia Google:", error);
      return done(error, null);
    }
  }
);

export default strategyGoogle;