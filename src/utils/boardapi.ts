import { Board } from './../entity/Board';
import { UpdateResult } from 'typeorm';

export const createBoard = async (
  data: JSON,
  meta: JSON,
  userId: string,
): Promise<Board> => {
  const transData = JSON.stringify(data);
  const transMeta = JSON.stringify(meta);

  return new Promise(async (res, rej) => {
    await Board.create({
      data: transData,
      meta: transMeta,
      user: { id: userId },
    })
      .save()
      .then((dat) => {
        res(dat);
      })
      .catch((err) => rej(err));
  });
};

export const updateBoard = (
  data: JSON,
  meta: JSON,
  userId: string,
  boardId: string,
): Promise<UpdateResult> => {
  const transData = JSON.stringify(data);
  const transMeta = JSON.stringify(meta);
  return new Promise(async (res, rej) => {
    await Board.update(
      { user: { id: userId }, id: boardId },
      { meta: transMeta, data: transData },
    )
      .then((dat) => {
        res(dat);
      })
      .catch((err) => rej(err));
  });
};

export const giveAccess = async (
  userId: string,
  boardId: string,
): Promise<UpdateResult> => {
  const board = await Board.findOne({ id: boardId });
  return new Promise(async (res, rej) => {
    await Board.update(
      { id: boardId },
      {
        access: [...board.access, userId],
      },
    )
      .then((dat) => {
        res(dat);
      })
      .catch((err) => {
        rej(err);
      });
  });
};
