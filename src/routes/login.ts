import express from 'express';
const router = express.Router();
import { User } from '../entity/User';
import { Token } from '../entity/Token';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createAccessToken from '../middlewares/createAccessToken';
require('dotenv').config();

//todo login endpoint
router.post('/', async (req, res) => {
  const userFound = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!userFound) {
    res.status(400).send('User not found');
  } else {
    const isUser = await bcrypt.compare(req.body.password, userFound.password);

    if (isUser) {
      const userId = userFound.id;
      const user = { id: userId };
      const userToken = createAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN, {
        expiresIn: '7d',
      });
      await Token.create({ tokenId: refreshToken, user: { id: userId } })
        .save()
        .then(() => {
          res
            .cookie('refreshToken', refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production' ? true : false,
              path: '/',
              maxAge: 864000000,
            })
            .cookie('loggedIn', true, {
              httpOnly: false,
              secure: process.env.NODE_ENV === 'production' ? true : false,
              maxAge: 864000000,
            })
            .json({
              accessToken: userToken,
              name: userFound.name,
              email: userFound.email,
              userId: userFound.id,
              username: userFound.username,
              imgUrl: userFound.imgUrl,
              createdAt: userFound.createdAt,
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(400).send('invalid email or password');
    }
  }
});

export default router;
