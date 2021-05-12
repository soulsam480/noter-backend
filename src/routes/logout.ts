import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
require('dotenv').config();

//todo logout endpoint
router.get('/', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken === undefined) res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN,
    async (err: any, user: any) => {
      if (err) res.sendStatus(403);
      res.clearCookie('refreshToken').clearCookie('loggedIn').sendStatus(200);
    },
  );
});

export default router;
