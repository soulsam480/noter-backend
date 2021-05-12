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
        res
          .cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod' ? true : false,
            path: '/',
            maxAge: 864000000,
          })
          .json({
            accessToken: newAccessToken,
          });
      },
    );
  } catch (error) {
    res.sendStatus(401);
  }
});

export default router;
