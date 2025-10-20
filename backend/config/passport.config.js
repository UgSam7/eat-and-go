import GoogleStrategy from 'passport-google-oauth20';
import { generateJWT } from '../helpers/jwt.js';
import User from '../models/User.js';

const strategyGoogle = new GoogleStrategy(
    // questo serve per cacciare il popup di Goolge
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_HOST}:${process.env.PORT}${process.env.GOOGLE_CALLBACK_PATH}`,
    },

    // callback che si attiva quando Google ci passa i dati del profilo
    async function (accessToken, refreshToken, profile, cb) {
        console.log(profile);

        // profile.id
        // profile._json contiene altri dati sull'utente

        // vediamo se l'utente esiste già
        let user = await User.findOne({ googleId: profile.id });

        try {
            // se l'utente non esiste già lo creiamo
            if (!user) {
                user = User.create({
                    firstName: profile._json.given_name,
                    lastName: profile._json.family_name,
                    email: profile._json.email,
                    profile: profile._json.picture
                        ? { path: profile._json.picture }
                        : null,
                    googleId: profile.id,
                });
            }

            console.log(user.id);
            const jwt = await generateJWT({ userId: user.id });
            cb(null, { jwt }); // {jwv } finisce in request.user
        } catch (error) {
            cb(error, null); // {jwv } finisce in request.user
        }
    }
);

export default strategyGoogle;

// http://localhost:4000/api/v1/login-google
