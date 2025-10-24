import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routers/user.router.js';
import mongoose from 'mongoose';
import restaurantsRouter from './routers/restaurant.router.js';
import passport from 'passport';
import strategyGoogle from './config/passport.config.js';
import authRouter from './routers/auth.router.js';
import authentication from './middlewares/authentication.js';

const server = express();
const port = process.env.PORT;

passport.use(strategyGoogle);

const app = express();
server.use(express.json());
server.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);



server.get('/api', (request, response) => response.send());

server.use('/api/v1/users', userRouter);
server.use('/api/restaurants', restaurantsRouter);
server.use('/api/auth', authRouter);


await mongoose
  .connect(process.env.MONGODB_CONNECTION_URI)
  .then(() => console.log('Connessi al database'));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
