import jwt from 'jsonwebtoken';
require('dotenv').config()
const verifyToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN, (err: any, user: any) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

export default verifyToken