import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { createConnection } from 'typeorm';
import Ws from './sockets/index';
//todo route imports
import register from './routes/register';
import login from './routes/login';
import token from './routes/token';
import logout from './routes/logout';
import getuserdata from './routes/getuserdata';

const app = express();
const port = process.env.PORT || 4000;
app.use(
  cors({
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//todo routes
/* app.use('/data', data);
 */ app.use('/register', register);
app.use('/login', login);
app.use('/token', token);
app.use('/logout', logout);
app.use('/getuserdata', getuserdata);

const server = http.createServer(app);

createConnection().then(() => {
  server.listen(port, () => {
    console.log(`app is listening on port ${port}`);
  });
});

process.on('uncaughtException', (e) => {
  console.log(e);
});
process.on('unhandledRejection', (e) => {
  console.log(e);
});
