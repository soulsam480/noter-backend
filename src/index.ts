import { userAuthInfoRequest } from './../custom.d';
import express from "express";
import cors from 'cors';
import jwt from "jsonwebtoken"
require('dotenv').config()
import bcrypt from 'bcrypt';
import User from "./db/user"
import Note from "./db/notes"
import Token from "./db/tokens"
import createAccessToken from './middlewares/createAccessToken';
import cookieParser from 'cookie-parser';

//todo
// ? add jwt token persistence 
// ? add create notes endpoint
// ? create a client

//todo middleware

const verifyToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN, (err: any, user: any) => {
        if (err) res.sendStatus(401)
        req.user = user
        next()
    })
}


const app = express()
const port = process.env.PORT || 4000;
app.use(cors(
    {
        origin: [
            "http://localhost:8080"
        ],
        credentials: true
    }
))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.get('/data', verifyToken, async (req: userAuthInfoRequest, res) => {
    res.send("reached notes")
    await Note.findAll({
        where: {
            userId: req.user.id
        }
    }).then(resp => res.send(resp)).catch(err => console.log(err)
    )

})

app.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    }

    await User.create(newUser).then(resp => res.send(resp)).catch(err => {
        console.log(err);
        res.send(err)
    })

})

app.post('/login', async (req, res) => {

    const userFound = await User.findOne({
        where: {
            email: req.body.email
        }
    })

    if (!userFound) {
        res.sendStatus(400).json({
            message: "Invalid Email or Password"
        })
    } else {
        const isUser = await bcrypt.compare(req.body.password, userFound.password)
        if (isUser) {
            const userId = userFound.id
            const user = { id: userId, email: userFound.email }
            const userToken = createAccessToken(user)
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN, {
                expiresIn: "7d"
            })
            await Token.create({ tokenId: refreshToken, userId: userFound.id } as Token).then(() => {
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV ? true : false,
                    path: "/token"
                }).cookie("loggedIn", true, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV ? true : false,
                    maxAge: 864000000
                })
                    .json({
                        accessToken: userToken,
                        name: userFound.name,
                        email: userFound.email,
                        userId: userFound.id,
                        expiresIn: 15000
                    })
            }).catch(err => {
                console.log(err);

            })
        } else {
            res.sendStatus(400).json({
                message: "Invalid Email or Password"
            })
        }
    }

})

app.post('/token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken === undefined) res.sendStatus(401);
    try {
        const refreshTokenFound = await Token.findOne({
            where: {
                tokenId: refreshToken
            }
        })

        if (!refreshTokenFound) res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err: any, user: any) => {
            if (err) return res.sendStatus(403);
            const newAccessToken = createAccessToken({ user: user.id })
            res.json({
                accesToken: newAccessToken
            })
        })
    } catch (error) {
        console.log(error);
        res.send(error)
    }

})

app.post('/logout', async (req, res) => {
    const userId = req.body.userId;
    if (userId === undefined) res.sendStatus(401);
    try {
        await Token.destroy({
            where: {
                userId: userId
            }
        }).then(() => {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                path: "/token"
            }).sendStatus(200)
        }).catch(() => {
            res.sendStatus(401);
        })
    } catch (error) {
        res.sendStatus(401);
    }

})


app.listen(port, () => {
    console.log(`app is listening on port ${port}`);

})