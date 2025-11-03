import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateJWT } from '../helpers/jwt.js';
import User from '../models/User.js';

const strategyGoogle = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_HOST}${process.env.GOOGLE_CALLBACK_PATH}`,
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Google profile ricevuto:", profile);

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

      
      const jwt = await generateJWT({ userId: user._id, email: user.email, role: user.role });

   
      return done(null, { jwt });
    } catch (error) {
      console.error("Errore strategia Google:", error);
      return done(error, null);
    }
  }
);

export default strategyGoogle;