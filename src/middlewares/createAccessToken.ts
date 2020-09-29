import jwt from 'jsonwebtoken';
require('dotenv').config()
const createAccessToken = (user: object) => {
    return jwt.sign(user, process.env.TOKEN, { expiresIn: "15m" })
}

export default createAccessToken