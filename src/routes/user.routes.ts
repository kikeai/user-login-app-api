import { Router } from 'express'
import User from '../database/models/User'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import { randomPassword } from '../utils/randomPassword'
import jwt from 'jsonwebtoken'
import { userStractor } from '../middlewares/userStractor'
dotenv.config()
const { SECRET_WORD } = process.env
if (SECRET_WORD === undefined) {
  throw new Error('secret word no declarated')
}

const userRoute = Router()

userRoute.get('/', userStractor, async (req, res, next) => {
  const { userId } = req
  const user = await User.findById(userId)
  if (user === null) {
    next()
    return
  }
  res.status(200).send(user)
})

userRoute.post('/', async (req, res, next) => {
  const { name, email, username, password, google_id, image } = req.body
  // Encuetro el user atraves del email
  const user = await User.findOne({ email })
  // Si encuentra un usuario envia un error
  if (user !== null) {
    res.status(409).json({ error: 'Este email ya está registrado' })
  } else {
    // Inicializo dos variables para asignarles su valor hasheado por bcrypt
    let passwordHash = randomPassword(10)
    const useGoogle = google_id === null ? '' : google_id
    if (password === '') {
      passwordHash = await bcrypt.hash(passwordHash, 10)
    } else {
      passwordHash = await bcrypt.hash(password, 10)
    }
    try {
      const newUser = await User.create({
        name,
        email,
        username,
        password: passwordHash,
        google_id: useGoogle,
        image
      })
      const userForToken = {
        id: newUser.id,
        username: newUser.username
      }
      const token = jwt.sign(
        userForToken,
        SECRET_WORD,
        {
          expiresIn: 60 * 60 * 24 * 7
        }
      )

      res.cookie('authToken', token, {
        sameSite: 'lax',
        path: '/',
        httpOnly: true
      }).send('Token initialized')
    } catch (error) {
      next(error)
    }
  }
})

userRoute.post('/login', async (req, res, next) => {
  const { email, password, google_id } = req.body
  // Busco si existe el usuario en la base de datos por el email
  const user = await User.findOne({ email })
  // Procedimiento si el usuario existe
  if (user !== null) {
    // Procedimiento si se inicia de manera convencional
    const userForToken = {
      id: user.id,
      username: user.username
    }
    if (password !== '' && google_id === null && user.password !== undefined) {
      const comparePassword = await bcrypt.compare(password, user.password)
      if (comparePassword) {
        const token = jwt.sign(
          userForToken,
          SECRET_WORD,
          {
            expiresIn: 60 * 60 * 24 * 7
          }
        )

        res.cookie('authToken', token, {
          sameSite: 'lax',
          path: '/',
          httpOnly: false
        }).send('Token initialized')
      } else {
        res.status(401).json({ error: 'Usuario o contraseña invalido' })
      }
    // Procedimiento si esta registrado pero no con google
    } else if (password === '' && google_id !== null && user.google_id === '') {
      try {
        user.google_id = google_id
        await user.save()
        const token = jwt.sign(
          userForToken,
          SECRET_WORD,
          {
            expiresIn: 60 * 60 * 24 * 7
          }
        )

        res.cookie('authToken', token, {
          sameSite: 'lax',
          path: '/',
          httpOnly: false
        }).send('Token initialized')
      } catch (error) {
        next(error)
      }
    // Procedimiento si se incia con googleAuth
    } else if (password === '' && google_id !== null && user.google_id !== undefined) {
      if (user.google_id === google_id) {
        const token = jwt.sign(
          userForToken,
          SECRET_WORD,
          {
            expiresIn: 60 * 60 * 24 * 7
          }
        )

        res.cookie('authToken', token, {
          sameSite: 'lax',
          path: '/',
          httpOnly: false
        }).send('Token initialized')
      } else {
        res.status(401).json({ error: 'Usuario o contraseña invalido' })
      }
    }
  // Procedemiento si el usuario no existe
  } else {
    res.status(401).json({ error: 'Usuario o contraseña invalido' })
  }
})

userRoute.post('/checkusername', async (req, res, next) => {
  try {
    const { username } = req.body
    const user = await User.findOne({ username })
    if (user !== null) {
      res.json({ response: 'Exist' })
    } else {
      res.json({ response: 'No Exist' })
    }
  } catch (error) {
    next(error)
  }
})

userRoute.put('/password', userStractor, async (req, res, next) => {
  const { newPassword } = req.body
  const { userId } = req

  const user = await User.findById(userId)
  if (user !== null) {
    if (user.password !== undefined) {
      const samePassword = await bcrypt.compare(newPassword, user.password)
      if (samePassword) {
        res.status(409).json({ error: 'Ya estas usando esta contraseña' })
      } else {
        try {
          const passwordHash = await bcrypt.hash(newPassword, 10)
          user.password = passwordHash
          await user.save()
          return res.json({ message: 'La contraseña se actualizó correctamente' })
        } catch (error) {
          next(error)
        }
      }
    }
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' })
  }
})

userRoute.put('/username', userStractor, async (req, res, next) => {
  const { newUsername } = req.body
  const { userId } = req

  const user = await User.findById(userId)
  if (user !== null) {
    try {
      user.username = newUsername
      await user.save()
      res.json({ message: 'El usuario se actualizó correctamente' })
    } catch (error) {
      next(error)
    }
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' })
  }
})

userRoute.put('/image', userStractor, async (req, res, next) => {
  const { newImage } = req.body
  const { userId } = req

  const user = await User.findById(userId)
  if (user !== null) {
    try {
      user.image = newImage
      await user.save()
      res.json({ message: 'La imagen se actualizó correctamente' })
    } catch (error) {
      next(error)
    }
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' })
  }
})

export default userRoute
