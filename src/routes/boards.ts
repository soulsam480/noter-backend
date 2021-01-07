import { userAuthInfoRequest } from './../../custom.d';
import { NextFunction, Request, Response } from 'express';
import { createBoard } from './../utils/boardapi';
import { Board } from '../entity/Board';
import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
require('dotenv').config();

//todo middleware

const verifyToken = (
  req: userAuthInfoRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN, (err: any, user: any) => {
    if (err) res.sendStatus(401);
    req.user = user;
    next();
  });
};

//todo data endpopint
router.get('/', verifyToken, async (req: userAuthInfoRequest, res) => {
  await Board.find({
    where: {
      user: { id: req.user.id },
    },
  })
    .then((resp) => res.send(resp))
    .catch((err) => {
      res.sendStatus(501);
      console.log(err);
    });
});

export default router;
