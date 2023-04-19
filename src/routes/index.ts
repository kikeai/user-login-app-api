import { Router } from 'express'
import userRoute from './user.routes'

const index = Router()

index.use('/user', userRoute)

export default index
