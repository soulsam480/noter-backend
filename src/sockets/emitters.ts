import { createBoard, updateBoard } from './../utils/boardapi';
import { Board } from './../entity/Board';
import { Socket } from 'socket.io';

export const sendAllBoards = async (sock: Socket, uid: string | any) => {
  sock.emit(
    'boards',
    await Board.find({
      where: {
        user: { id: uid },
      },
    }),
  );
};

export const createSendBoards = async (sock: Socket, data: any) => {
  await createBoard(data.data, data.meta, data.userId).then(async (res) => {
    sock.emit('board-created', res);
    sock.emit(
      'boards',
      await Board.find({
        where: {
          user: { id: data.userId },
        },
      }),
    );
  });
};

export const updateSendBoard = async (sock: Socket, data: any) => {
  await updateBoard(data.data, data.meta, data.userId, data.boardId).then(
    async () => {
      sock.emit(
        'boards',
        await Board.find({
          where: {
            user: { id: data.userId },
          },
        }),
      );
    },
  );
};
