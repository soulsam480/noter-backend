import { SocketWithUser } from './../../custom.d';
import {
  createSendBoards,
  deleteBoard,
  giveUserAccesToBoard,
  sendAllBoards,
  updateSendBoard,
} from './emitters';
import { Server } from 'socket.io';

export default (ws: Server) => {
  ws.on('connection', (sock: SocketWithUser) => {
    sock.on('get-boards', async () => {
      sendAllBoards(sock);
    });

    sock.on('create-board', async (data) => {
      createSendBoards(sock, data);
    });

    sock.on('update-board', async (data) => {
      updateSendBoard(sock, data);
    });

    sock.on('delete-board', async (data) => {
      await deleteBoard(sock, data).then(() => sendAllBoards(sock));
    });

    sock.on('give-access-board', async (data) => {
      await giveUserAccesToBoard(sock, data);
    });
  });
};
