import { type UpdatePassword, type Login, type Users, type UpdateUsername, type UpdateImage } from '../types'
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

export const singupUser = async (newUser: Users): Promise<any> => {
  const { name, email, username, password, google_id, image }: Users = newUser
  // Encuetro el user atraves del email
  const user = await User.findOne({ email })
  // Si encuentra un usuario envia un error
  if (user !== null) {
    throw Error('Este email ya esta registrado')
  } else {
    // Inicializo dos variables para asignarles su valor hasheado por bcrypt
    let passwordHash = randomPassword(10)
    let googleIdHash = ''

    if (google_id !== null) {
      googleIdHash = await bcrypt.hash(google_id, 10)
    } else {
      passwordHash = await bcrypt.hash(password, 10)
    }
    try {
      const newUser = await User.create({
        name,
        email,
        username,
        password: passwordHash,
        google_id: googleIdHash,
        image
      })
      return newUser
    } catch (error) {
      throw Error('El usuario no pudo ser creado')
    }
  }
}

export const loginUser = async (userlog: Login): Promise<any> => {
  const { email, password, google_id } = userlog
  // Busco si existe el usuario en la base de datos por el email
  const user = await User.findOne({ email })
  // Procedimiento si el usuario existe
  if (user !== null) {
    // Procedimiento si se inicia de manera convencional
    if (password !== '' && google_id === null && user.password !== undefined) {
      const comparePassword = await bcrypt.compare(password, user.password)
      if (comparePassword) {
        return user
      } else {
        throw Error('contraseña incorrecta')
      }
    // Procedimiento si esta registrado pero no con google
    } else if (password === '' && google_id !== null && user.google_id === '') {
      const googleHash = await bcrypt.hash(google_id, 10)
      try {
        user.google_id = googleHash
        await user.save()
        return user
      } catch (error) {
        throw Error('No se pudo iniciar sesión')
      }
    // Procedimiento si se incia con googleAuth
    } else if (password === '' && google_id !== null && user.google_id !== undefined) {
      const compareGoogleId = await bcrypt.compare(google_id, user.google_id)
      if (compareGoogleId) {
        return user
      } else {
        throw Error('contraseña incorrecta')
      }
    }
  // Procedemiento si el usuario no existe
  } else {
    throw Error('No existe una cueta asociada a este email')
  }
}

export const updatePassword = async (update: UpdatePassword): Promise<any> => {
  const { email, newPassword } = update

  const user = await User.findOne({ email })
  if (user !== null) {
    try {
      const passwordHash = await bcrypt.hash(newPassword, 10)
      user.password = passwordHash
      await user.save()
      return { message: 'La contraseña se actualizó correctamente' }
    } catch (error) {
      throw Error('No se pudo actualizar la contraseña, intenta de nuevo')
    }
  } else {
    throw Error('Usuario no encontrado')
  }
}

export const updateUsername = async (update: UpdateUsername): Promise<any> => {
  const { email, newUsername } = update
  const user = await User.findOne({ email })
  if (user !== null) {
    try {
      user.username = newUsername
      await user.save()
      return user
    } catch (error) {
      throw Error('No se pudo actualizar el usuario, intenta de nuevo')
    }
  } else {
    throw Error('Usuario no encontrado')
  }
}

export const updateImage = async (update: UpdateImage): Promise<any> => {
  const { email, newImage } = update

  const user = await User.findOne({ email })
  if (user !== null) {
    try {
      user.image = newImage
      await user.save()
      return user
    } catch (error) {
      throw Error('No se pudo actualizar la imagen, intenta de nuevo')
    }
  } else {
    throw Error('Usuario no encontrado')
  }
}
