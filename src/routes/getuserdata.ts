import { User } from './../entity/User';
import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';

require('dotenv').config();

// todo user data endpoint for persisting users
router.get('/', async (req, res) => {
  const header = req.headers.authorization;
  const token = header.split(' ')[1];
  if (token === undefined) res.sendStatus(401);
  try {
    jwt.verify(token, process.env.TOKEN, async (err: any, user: any) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      } else {
        const userFound = await User.findOne({
          where: {
            id: user.id,
          },
        });

        if (!userFound) res.sendStatus(401);

        res.json({
          name: userFound.name,
          email: userFound.email,
          userId: userFound.id,
          username: userFound.username,
          imgUrl: userFound.imgUrl,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

export default router;
