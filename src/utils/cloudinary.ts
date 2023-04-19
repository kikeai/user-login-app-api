import cloudinaryModule from 'cloudinary'
import * as dotenv from 'dotenv'
dotenv.config()
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

const cloudinary = cloudinaryModule.v2

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
})

module.exports = cloudinary
