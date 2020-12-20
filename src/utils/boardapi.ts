import { /* DeleteResult, */ UpdateResult } from 'typeorm';
import { Board } from '../entity/Board';

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

/* export const deleteBoard = (
  userId: string,
  boardId: string,
): Promise<DeleteResult> => {
  return new Promise(async (res, rej) => {
    await Board.delete({
      user: {
        id: userId,
      },
      id: boardId,
    })
      .then((dat) => {
        res(dat);
      })
      .catch((err) => rej(err));
  });
}; */
