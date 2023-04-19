import express from 'express'
import morgan from 'morgan'
import index from './routes'
import connectDb from './database/database'
import * as dotenv from 'dotenv'
import { notFound } from './middlewares/notFound'
dotenv.config()
const { PORT } = process.env

connectDb()

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})
app.use(index)
app.use(notFound)

app.listen(PORT, () => {
  console.log('server run on port', PORT)
})
