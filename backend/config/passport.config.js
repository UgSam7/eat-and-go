import GoogleStrategy from 'passport-google-oauth20';
import { generateJWT } from '../helpers/jwt.js';
import User from '../models/User.js';

const strategyGoogle = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_HOST}:${process.env.PORT}${process.env.GOOGLE_CALLBACK_PATH}`,
    },

    async function (accessToken, refreshToken, profile, cb) {
        console.log(profile);

        let user = await User.findOne({ googleId: profile.id });

        try {
            if (!user) {
                user = await User.create({
                    firstName: profile._json.given_name,
                    lastName: profile._json.family_name,
                    email: profile._json.email,
                    profile: profile._json.picture
                        ? { path: profile._json.picture }
                        : null,
                    googleId: profile.id,
                });
            }

            const jwt = await generateJWT({ userId: user.id });
            cb(null, { jwt }); // 
        } catch (error) {
            cb(error, null); 
        }
    }
);

export default strategyGoogle;


