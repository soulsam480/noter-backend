import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';
import createAccessToken from '../middlewares/createAccessToken';
require('dotenv').config();
//todo register endpoint
router.post('/', async (req, res) => {
  const salt = await bcrypt.genSalt();
  const resp = await User.findOne({
    where: { email: req.body.email },
  });

  if (resp)
    return res.status(400).send({
      message: 'User already exists!',
    });

  const hashedPass = await bcrypt.hash(req.body.password, salt);
  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
    username: req.body.username,
  })
    .save()
    .then(async (resp) => {
      const userToken = createAccessToken({ id: resp.id });
      const refreshToken = jwt.sign(
        { id: resp.id },
        process.env.REFRESH_TOKEN,
        {
          expiresIn: '7d',
        },
      );
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
          name: resp.name,
          email: resp.email,
          userId: resp.id,
          username: resp.username,
          imgUrl: resp.imgUrl,
          createdAt: resp.createdAt,
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(501).send(err);
    });
});

export default router;
