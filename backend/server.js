import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRouter from './routers/user.router.js';



const server = express();
const port = process.env.PORT;

server.use (cors());
server.use (express.json())

server.get ('/api', (request, response) => response.send ('Hello World!'));

server.use('/api/users', userRouter);



server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});