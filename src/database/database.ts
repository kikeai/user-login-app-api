import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()
const { MONGO_PASSWORD } = process.env

if (MONGO_PASSWORD === undefined) {
  throw new Error('Mongo password is not defined')
}

const mongoURL = `mongodb+srv://kikeai:${MONGO_PASSWORD}@userapp.chcaqva.mongodb.net/?retryWrites=true&w=majority`

const connectDb = function (): void {
  mongoose.connect(mongoURL)
    .then(res => {
      console.log('DATABASE CONNECTED')
    })
    .catch(error => {
      console.error(error)
    })
}

export default connectDb
