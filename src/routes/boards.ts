import { createBoard } from './../utils/boardapi';
import { Board } from '../entity/Board';
import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import { userAuthInfoRequest } from '../../custom';
require('dotenv').config();

//todo middleware

const verifyToken = (req: any, res: any, next: any) => {
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
