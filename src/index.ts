import jwt from 'jsonwebtoken';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { createConnection } from 'typeorm';
import { Ws } from './sockets/index';

//todo route imports
import register from './routes/register';
import login from './routes/login';
import token from './routes/token';
import logout from './routes/logout';
import getuserdata from './routes/getuserdata';
require('dotenv').config();

//todo main
const app = express();
const port = process.env.PORT || 4000;
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:8081', 'http://localhost:8080'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//todo routes
app.use('/register', register);
app.use('/login', login);
app.use('/token', token);
app.use('/logout', logout);
app.use('/user', getuserdata);

const server = http.createServer(app);

createConnection().then(() => {
  server.listen(port, () => {
    console.log(`app is listening on port ${port}`);
  });
});

export const ws = new Ws(server).io;

ws.use((socket, next) => {
  console.log(socket);
  //@ts-ignore
  const header = socket.handshake.headers['Authorization'];
  if (!header) return next(new Error('authentication error'));
  const token = header.split(' ')[1];
  return jwt.verify(token, process.env.TOKEN, (err: any, user: any) => {
    if (err) {
      console.log(err);
      return next(new Error('authentication error'));
    } else {
      return next();
    }
  });
});

process.on('uncaughtException', (e) => {
  console.log(e);
});
process.on('unhandledRejection', (e) => {
  console.log(e);
});
