import { SocketWithUser } from './../../custom.d';
import { createBoard, updateBoard, giveAccess } from './../utils/boardapi';
import { Board } from './../entity/Board';

export const sendAllBoards = async (sock: SocketWithUser) => {
  sock.emit(
    'boards',
    await Board.find({
      where: [
        {
          user: { id: sock.userId },
        },
        { access: [sock.userId] },
      ],
    }),
  );
};

export const createSendBoards = async (sock: SocketWithUser, data: any) => {
  await createBoard(data.data, data.meta, sock.userId).then(async (res) => {
    sock.emit('board-created', res);
    await sendAllBoards(sock);
  });
};

export const updateSendBoard = async (sock: SocketWithUser, data: any) => {
  await updateBoard(data.data, data.meta, sock.userId, data.boardId).then(
    async () => {
      await sendAllBoards(sock);
    },
  );
};

export const deleteBoard = async (sock: SocketWithUser, data: any) => {
  Board.delete({ id: data.boardId })
    .then(async () => {
      sock.emit('success', {
        message: 'success',
      });
    })
    .catch(async (err) => {
      sock.emit('error', err);
    });
};

export const giveUserAccesToBoard = async (sock: SocketWithUser, data: any) => {
  const { boardId, requestUserId } = data;
  await giveAccess(requestUserId, boardId)
    .then(() => {
      sock.emit('success', {
        message: 'success',
      });
    })
    .catch((err) => {
      sock.emit('error', err);
    });
};
