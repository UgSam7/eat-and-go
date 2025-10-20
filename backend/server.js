import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routers/user.router.js';
import mongoose from 'mongoose';
import restaurantsRouter from './routers/restaurant.router.js';
import passport from 'passport';
import strategyGoogle from './config/passport.config.js';
import authRouter from './routers/auth.router.js';

const server = express();
const port = process.env.PORT;

passport.use(strategyGoogle);

server.use(cors());
server.use(express.json());


server.get('/api', (request, response) => response.send('Hello World!'));

server.use('/api/v1/users', userRouter);
server.use('/restaurants', restaurantsRouter);
server.use('/api/auth', authRouter);
server.use('/restaurants', restaurantsRouter);


await mongoose
  .connect(process.env.MONGODB_CONNECTION_URI)
  .then(() => console.log('Connessi al database'));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
