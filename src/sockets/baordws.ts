import { Server, Socket } from 'socket.io';
import { Board } from './../entity/Board';
import { createBoard } from './../utils/boardapi';

export default (ws: Server) => {
  ws.on('connection', (sock: Socket) => {
    console.log('connected');
    sock.on('create-board', async (data) => {
      console.log(data);
      await createBoard(data.data, data.meta, data.userId);
      sock.emit(
        'boards',
        await Board.find({
          where: {
            user: { id: data.userId },
          },
        }),
      );
    });
  });
};
