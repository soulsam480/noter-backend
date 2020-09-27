import { userAuthInfoRequest } from './../custom.d';
import express from "express";
import cors from 'cors';
import jwt from "jsonwebtoken"
require('dotenv').config()
import bcrypt from 'bcrypt';
import User from "./db/user"
import Note from "./db/notes"

//todo
// ? add jwt token persistence 
// ? add create notes endpoint
// ? create a client


const verifyToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN, (err: any, user: any) => {
        if (err) return res.send(err)
        req.user = user
        next()
    })
}


const app = express()
const port = process.env.PORT || 3000;
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
        res.send("not registered")
    } else {
        const isUser = await bcrypt.compare(req.body.password, userFound.password)
        if (isUser) {
            const userId = userFound.id
            const user = { id: userId }
            const userToken = jwt.sign(user, process.env.TOKEN)
            res.json({
                token: userToken
            })
        } else {
            res.send("password Incorrect")
        }
    }

})


app.listen(port, () => {
    console.log(`app is listening on port ${port}`);

})