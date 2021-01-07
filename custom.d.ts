import { Request } from 'express';
import { Socket } from 'socket.io';
export interface userAuthInfoRequest extends Request {
  user?: {
    id?: string;
  };
}

export interface SocketWithUser extends Socket {
  userId: string;
}
