import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs';
import { prisma } from './db'
import { generateToken } from './utils';
import { authentication } from './middleware';

const app = express();

app.use(express.json());
app.use(cors());
const database = [];


app.post("/auth/register", async function (req, res) {
  const { username, useremail, pass, userrole } = req.body;

  const passwordHash = await bcrypt.hash(pass, 10)

  const user = await prisma.user.create({
    data: {
      name: username,
      email: useremail,
      password: passwordHash,
      role: userrole,
    },
  });
  const { access_token, refresh_token } = generateToken(user?.id)
  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      refresh_token: refresh_token
    }
  })

  res.send(access_token);
});



app.post('/auth/login', async function (req, res) {
  const { useremail, pass } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: useremail
    }
  })
  const isPasswordMatched = await bcrypt.compare(pass, user?.password)
  if (!isPasswordMatched) {
    return res.send("User not found | Invalid password")
  }
  const { access_token, refresh_token } = generateToken(user?.id)

  await prisma.user.update({
    where: {
      id: user?.id || "",
    },
    data: {
      refresh_token: refresh_token
    }
  })


  res.send(access_token)
})



app.post("/create-course", authentication, async function (req, res) {
  const data = req.body;
  const { name, description, duration, staffId, price, thumbnail } = data;
  await prisma.course.create({
    data: {
      title: name,
      description: description,
      price: price,
      thumbnail: thumbnail,
      staffId: staffId
    }
  })
})




app.listen(3000, function () {
  console.log("Server is running on 3000");
});
