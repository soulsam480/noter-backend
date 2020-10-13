import express from "express";
const router = express.Router()
import bcrypt from "bcrypt"
import User from "../db/user"



//todo register endpoint
router.post('/', async (req, res) => {
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

export default router