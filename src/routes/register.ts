import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import { User } from '../entity/User';

//todo register endpoint
router.post('/', async (req, res) => {
  const salt = await bcrypt.genSalt();
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
    username: req.body.username,
  })
    .save()
    .then((resp) =>
      res.send({
        email: resp.email,
        username: resp.username,
        name: resp.name,
        imgUrl: resp.imgUrl,
        createdAt: resp.createdAt,
        userId: resp.id,
      }),
    )
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

export default router;
