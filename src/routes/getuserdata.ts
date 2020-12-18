import { User } from './../entity/User';
import { Token } from './../entity/Token';
import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';

import createAccessToken from '../middlewares/createAccessToken';
require('dotenv').config();

// todo user data endpoint for persisting users
router.post('/', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken === undefined) res.sendStatus(401);
  try {
    const refreshTokenFound = await Token.findOne({
      where: {
        tokenId: refreshToken,
      },
    });

    if (!refreshTokenFound) res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN,
      async (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        const newAccessToken = createAccessToken({ user: user.id });
        const userFound = await User.findOne({
          where: {
            id: user.id,
          },
        });
        if (!userFound) res.sendStatus(401);

        res.json({
          accesToken: newAccessToken,
          name: userFound.name,
          email: userFound.email,
          userId: userFound.id,
          username: userFound.username
        });
      },
    );
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

export default router;
