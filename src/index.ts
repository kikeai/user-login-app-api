import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import index from './routes'
import connectDb from './database/database'
import * as dotenv from 'dotenv'
import { notFound } from './middlewares/notFound'
import { errorHandler } from './middlewares/errorHandler'
dotenv.config()
const { PORT } = process.env

connectDb()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})
app.use(index)
app.use(errorHandler)
app.use(notFound)

app.listen(PORT, () => {
  console.log('server run on port', PORT)
})

export default app
