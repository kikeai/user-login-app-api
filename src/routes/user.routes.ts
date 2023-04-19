import { Router } from 'express'
import { getUsers, loginUser, singupUser, updateImage, updatePassword, updateUsername } from '../controllers/user.controller'

const userRoute = Router()

userRoute.get('/', getUsers)

userRoute.post('/', singupUser)

userRoute.post('/login', loginUser)

userRoute.put('/password', updatePassword)

userRoute.put('/username', updateUsername)

userRoute.put('/image', updateImage)

export default userRoute
