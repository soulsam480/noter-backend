import jwt from 'jsonwebtoken';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { createConnection } from 'typeorm';
import { createWsServer } from './sockets/index';
import boardSockets from './sockets/baordws';
import register from './routes/register';
import login from './routes/login';
import token from './routes/token';
import logout from './routes/logout';
import getuserdata from './routes/getuserdata';
import boards from './routes/boards';
require('dotenv').config();
import { join } from 'path';
import { SocketWithUser } from 'custom';

const app = express();
const port = process.env.PORT || 4000;
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:8081',
      'http://localhost:8080',
      'http://localhost:8085',
      'https://noter.sambitsahoo.com',
    ],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/register', register);
app.use('/login', login);
app.use('/token', token);
app.use('/logout', logout);
app.use('/user', getuserdata);
app.use('/boards', boards);
const server = http.createServer(app);

async function main() {
  createConnection({
    type: 'sqlite',
    database: join(__dirname, '../db.sqlite'),
    entities: [join(__dirname, './entity/*')],
    migrations: [join(__dirname, './migrations/*')],
    logging: process.env.NODE_ENV === 'dev',
  }).then(async (conn) => {
    await conn.runMigrations();
    server.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    });
  });

  const ws = createWsServer(server).use((socket: SocketWithUser, next) => {
    const header = socket.handshake.headers['authorization'];
    if (!header) return next(new Error('authentication error'));
    const token = header.split(' ')[1];
    return jwt.verify(token, process.env.TOKEN, (err: any, user: any) => {
      if (err) {
        return next(new Error('authentication error'));
      } else {
        socket.userId = user.id;
        return next();
      }
    });
  });
  boardSockets(ws);
}

main();
process.on('uncaughtException', (e) => {
  console.log(e);
});
process.on('unhandledRejection', (e) => {
  console.log(e);
});
