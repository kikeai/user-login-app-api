import { Router } from 'express'
import userRoute from './user.routes'
import cookiesRoute from './cookies.routes'

const index = Router()

index.get('/', (req, res) => {
  res.send('SERVER FUNCTIONAL')
})

index.use('/user', userRoute)
index.use('/cookie', cookiesRoute)

export default index
