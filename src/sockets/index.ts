import socket, { Server } from 'socket.io';
import { Server as httpServer } from 'http';

export default class Ws {
  public io: Server;

  constructor(server: httpServer) {
    this.io = socket(server, {
      path: '/ws',
    });
  }
}
