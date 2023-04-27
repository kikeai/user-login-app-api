import { Router } from 'express'
import { availibleUsername, loginUser, singupUser, updateImage, updatePassword, updateUsername } from '../controllers/user.controller'
import User from '../database/models/User'

const userRoute = Router()

userRoute.get('/', async (req, res, next) => {
  const users = await User.find()
  if (users[0] === undefined) {
    next()
    return
  }
  res.status(200).send(users)
  // try {
  //   const users = await getUsers()
  //   res.send(users)
  // } catch (error: any) {
  //   res.status(400).json({ error: error.message })
  // }
})

userRoute.post('/', async (req, res, next) => {
  try {
    const newUser = await singupUser(req.body)
    res.status(200).send(newUser)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

userRoute.post('/login', async (req, res, next) => {
  try {
    const userLogged = await loginUser(req.body)
    res.status(200).send(userLogged)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

userRoute.post('/checkusername', async (req, res, next) => {
  try {
    const userCheck = await availibleUsername(req.body)
    res.status(200).send(userCheck)
  } catch (error: any) {
    res.status(400).json({ error })
  }
})

userRoute.put('/password', async (req, res, next) => {
  try {
    const result = await updatePassword(req.body)
    res.status(200).send(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

userRoute.put('/username', async (req, res, next) => {
  try {
    const newUser = await updateUsername(req.body)
    res.status(200).send(newUser)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

userRoute.put('/image', async (req, res, next) => {
  try {
    const newUser = await updateImage(req.body)
    res.status(200).send(newUser)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default userRoute
