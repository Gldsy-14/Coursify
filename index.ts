import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import "dotenv/config"
import { prisma } from "./db"
import bcrypt from 'bcryptjs'

const app = express();

app.use(express.json());
app.use(cors());

const users: { name: string, email: string, password: string }[] = []
app.post("/auth/register", async function (req, res) {
  const { name, email, password, role } = req.body;

  const hashPass = await bcrypt.hash(password, 10)


  await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashPass,
      role: role
    }
  })

  const id = '12345678';

  if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
    return;
  }
  const access_token = jwt.sign(
    {
      id: id
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "15m"
    }
  )

  console.log(access_token)

  // 1. Id -> User id
  // 2. Secret -> key
  // 3. Expiry -> token exp


  const refresh_token = jwt.sign(
    {
      id: id
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "30d"
    }
  )

  await prisma.user.update({
    where: {
      id: "123"
    },
    data: {
      refresh_token: await bcrypt.hash(refresh_token, 10)
    }
  })





  res.send(access_token)


})

app.post('/auth/login', async function (req, res) {
  const { email, password } = req.body;


  // Find this user from database using email
  const user = users.find((u) => u.email === email)




  1
  if (user?.password !== password) {
    return;
  }

  const id = "123456789";


  if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
    return;
  }
  const access_token = jwt.sign(
    {
      id: id
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "15m"
    }
  )

  console.log(access_token)

  // 1. Id -> User id
  // 2. Secret -> key
  // 3. Expiry -> token exp


  const refresh_token = jwt.sign(
    {
      id: id
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "30d"
    }
  )

  console.log(refresh_token)
  res.send(access_token)

})



app.get("/users", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: "37d310e8-a203-4eb4-a3ae-ce5177a317a0"
    }
  })

  // await prisma.user.delete({
  //   where: {
  //     id: "37d310e8-a203-4eb4-a3ae-ce5177a317a0"
  //   }
  // })
  res.json(user)
})
app.listen(3000, function () {
  console.log("Server is running on 3000");
});

