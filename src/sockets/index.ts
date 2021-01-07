import { Server } from 'socket.io';
import { Server as httpServer } from 'http';

let ws: Server;
export const createWsServer = (server: httpServer): Server => {
  ws = new Server(server, {
    path: '/ws',
    cors: {
      origin: [
        'http://localhost:8080',
        'http://localhost:8085',
        'https://noter.sambitsahoo.com',
      ],
      methods: ['GET', 'POST'],
      allowedHeaders: ['Authorization'],
      credentials: true,
    },
  });
  return ws;
};

export { ws };
