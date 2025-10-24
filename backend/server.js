import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';

import strategyGoogle from './config/passport.config.js';
import userRouter from './routers/user.router.js';
import restaurantsRouter from './routers/restaurant.router.js';
import authRouter from './routers/auth.router.js';

passport.use(strategyGoogle);

const server = express();

server.use(express.json());
server.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://eat-and-go-five.vercel.app"
    ],
    credentials: true,
  })
);

server.get('/', (req, res) => {
  res.send('Backend Eat&Go attivo!');
});

server.use('/api/v1/users', userRouter);
server.use('/api/restaurants', restaurantsRouter);
server.use('/api/auth', authRouter);

await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
console.log('Connesso al database MongoDB');

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server attivo su porta ${PORT}`);
});