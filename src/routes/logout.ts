import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import Token from "../db/tokens"
require('dotenv').config()


//todo logout endpoint
router.post('/', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken === undefined) res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err: any, user: any) => {
        if (err) res.sendStatus(403)
        try {
            await Token.destroy({
                where: {
                    userId: user.id
                }
            }).then(() => {
                res.clearCookie("refreshToken").clearCookie("loggedIn").sendStatus(200)
            }).catch(() => {
                res.sendStatus(401);
            })
        } catch (error) {
            res.sendStatus(401);
        }
    })

})

export default router