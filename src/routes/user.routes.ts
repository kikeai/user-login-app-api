import { Router } from 'express'
import { getUsers, loginUser, singupUser, updateImage, updatePassword, updateUsername } from '../controllers/user.controller'

const userRoute = Router()

userRoute.get('/', async (req, res, next) => {
  try {
    const users = await getUsers()
    res.send(users)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
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

userRoute.put('/password', updatePassword)

userRoute.put('/username', updateUsername)

userRoute.put('/image', updateImage)

export default userRoute
