import { createSendBoards, sendAllBoards, updateSendBoard } from './emitters';
import { Server, Socket } from 'socket.io';

export default (ws: Server) => {
  ws.on('connection', (sock: Socket) => {
    //todo send boards on connection
    sock.on('get-boards', async ({ uid }) => {
      sendAllBoards(sock, uid);
    });

    //todo create and send boards on create-board
    sock.on('create-board', async (data) => {
      createSendBoards(sock, data);
    });

    sock.on('update-board', async (data) => {
      console.log(data);

      updateSendBoard(sock, data);
    });
  });
};
