import { type Request, type Response } from 'express'
import { type Users } from '../types'
import bcrypt from 'bcrypt'
import User from '../database/models/User'
import { randomPassword } from '../utils/randomPassword'

export const getUsers = async (): Promise<any> => {
  try {
    const users = await User.find()
    if (users[0] === undefined) {
      throw Error('Usuarios no encontrados')
    }
    return users
  } catch (error: any) {
    throw Error(error.message)
  }
}

export const singupUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, username, password, google_id, image }: Users = req.body
  // Encuetro el user atraves del email
  const user = await User.findOne({ email })
  // Si encuentra un usuario envia un error
  if (user !== null) {
    res.status(400).json({ error: 'Este email ya esta registrado' })
  } else {
    // Inicializo dos variables para asignarles su valor hasheado por bcrypt
    let passwordHash = randomPassword(10)
    let googleIdHash = ''

    if (google_id !== null) {
      googleIdHash = await bcrypt.hash(google_id, 10)
    } else {
      passwordHash = await bcrypt.hash(password, 10)
    }
    const newUser = await User.create({
      name,
      email,
      username,
      password: passwordHash,
      google_id: googleIdHash,
      image
    })

    res.status(200).send(newUser)
  }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, google_id } = req.body
  // Busco si existe el usuario en la base de datos por el email
  const user = await User.findOne({ email })
  // Procedimiento si el usuario existe
  if (user !== null) {
    // Procedimiento si se inicia de manera convencional
    if (password !== '' && google_id === null && user.password !== undefined) {
      const comparePassword = await bcrypt.compare(password, user.password)
      if (comparePassword) {
        res.status(200).json({ name: user.name, email: user.email, username: user.username, image: user.image })
      } else {
        res.status(401).json({ error: 'contraseña incorrecta' })
      }
    // Procedimiento si se incia con googleAuth
    } else if (password === '' && google_id !== null && user.google_id !== undefined) {
      const compareGoogleId = await bcrypt.compare(google_id, user.google_id)
      if (compareGoogleId) {
        res.status(200).json({ name: user.name, email: user.email, username: user.username, image: user.image })
      } else {
        res.status(401).json({ error: 'contraseña incorrecta' })
      }
    }
  // Procedemiento si el usuario no existe
  } else {
    res.status(400).json({ error: 'No existe una cueta asociada a este email' })
  }
}

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword } = req.body

  try {
    const user = await User.findOne({ email })
    if (user !== null) {
      const passwordHash = await bcrypt.hash(newPassword, 10)
      user.password = passwordHash
      await user.save()
    }
    res.status(200).json({ message: 'Update password correctly' })
  } catch (error) {
    console.error(error)
  }
}

export const updateUsername = async (req: Request, res: Response): Promise<void> => {
  const { email, newUsername } = req.body

  const user = await User.findOne({ email })
  if (user !== null) {
    user.username = newUsername
    await user.save()
  }

  res.status(200).json(user)
}

export const updateImage = async (req: Request, res: Response): Promise<void> => {
  const { email, newImage } = req.body

  const user = await User.findOne({ email })
  if (user !== null) {
    user.image = newImage
    await user.save()
  }

  res.status(200).json(user)
}
