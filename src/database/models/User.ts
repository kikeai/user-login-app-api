import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  email: String,
  name: String,
  username: String,
  password: String,
  google_id: String,
  image: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
    delete returnedObject.google_id
  }
})

const User = model('user', userSchema)

export default User
