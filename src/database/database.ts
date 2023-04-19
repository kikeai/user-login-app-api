import mongoose from 'mongoose'

const connectDb = function (): void {
  mongoose.connect('mongodb://127.0.0.1:27017/userApp')
    .then(res => {
      console.log('DATABASE CONNECTED')
    })
    .catch(error => {
      console.error(error)
    })
}

export default connectDb
