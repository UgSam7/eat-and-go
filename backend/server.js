import express from 'express';
import 'dotenv/config';

const server = express();
const port = process.env.PORT;

server.get ('/', (request, response) => response.send ('Hello World!'));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});