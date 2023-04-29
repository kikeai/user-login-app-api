import { Router } from 'express'

const cookiesRoute = Router()

cookiesRoute.get('/create', (req, res) => {
  res
    .status(202)
    .cookie('Token', 'AdkKJ39.JSIFkalklsfifLKFfji45', {
      sameSite: 'strict',
      path: '/',
      httpOnly: true
    }).send('cookie being initialised')
})
cookiesRoute.get('/delete', (req, res) => {
  res
    .status(202)
    .clearCookie('authToken').send('cookies cleared')
})

export default cookiesRoute
