import { Token } from './../entity/Token';
import express from 'express';
const router = express.Router();
import createAccessToken from '../middlewares/createAccessToken';
import jwt from 'jsonwebtoken';
require('dotenv').config();

// todo newtoken endpoint
router.post('/', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken === undefined) return res.sendStatus(401);
  try {
    const refreshTokenFound = await Token.findOne({
      where: {
        tokenId: refreshToken,
      },
    });

    if (!refreshTokenFound) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN,
      async (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        const newAccessToken = createAccessToken({ id: user.id });
        const newRefreshToken = jwt.sign(
          { id: user.id },
          process.env.REFRESH_TOKEN,
          {
            expiresIn: '7d',
          },
        );
        await Token.delete({ user: user.id })
          .then(async () => {
            await Token.create({ tokenId: newRefreshToken, user: user.id })
              .save()
              .then(() => {
                res
                  .cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure:
                      process.env.NODE_ENV === 'production' ? true : false,
                    path: '/',
                    maxAge: 864000000,
                  })
                  .json({
                    accessToken: newAccessToken,
                  });
              })
              .catch((err) => {
                console.log(err);
                res.send(err);
              });
          })
          .catch((err) => console.log(err));
      },
    );
  } catch (error) {
    res.sendStatus(401);
  }
});

export default router;
