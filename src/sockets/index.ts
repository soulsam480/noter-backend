import { Server } from 'socket.io';
import { Server as httpServer } from 'http';

export class Ws {
  io: Server;

  constructor(server: httpServer) {
    this.io = new Server(server, {
      path: '/ws',
      cors: {
        origin: ['http://localhost:8080'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization'],
        credentials: true,
      },
    });
  }
}
