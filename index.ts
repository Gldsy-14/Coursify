import express from 'express'
import cors from 'cors'
import { prisma } from './db'

const app = express();

app.use(express.json());
app.use(cors());
const database = [];
/**
 * {
 * username: ramu,
 * email: a@gmail.com,
 * pass: asdf
 * }
 */
app.post("/auth/register", async function (req, res) {
  const { username, useremail, pass, userrole } = req.body;

  await prisma.user.create({
    data: {
      name: username,
      email: useremail,
      password: pass,
      role: userrole,
    },
  });

  res.send("user stored");
});

app.post('/auth/login', async function (req, res) {
  const { useremail, pass } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: useremail
    }
  })
  if (user?.password !== pass) {
    return res.send("User not found | Invalid password")
  }
  res.json(user)
})

app.post('/user/update/:id', async function (req, res) {
  const { useremail, pass } = req.body;
  const user = await prisma.user.update({
    where: {
      id: req.params.id
    },
    data: {
      email: useremail
    }
  })
  if (user?.password !== pass) {
    return res.send("User not found | Invalid password")
  }
  res.json(user)
})


app.listen(3000, function () {
  console.log("Server is running on 3000");
});
