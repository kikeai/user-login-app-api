import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { type Request, type Response, type NextFunction } from 'express'
import { type DecodedToken } from '../types'
dotenv.config()
const { SECRET_WORD } = process.env
if (SECRET_WORD === undefined) {
  throw new Error('secret word no declarated')
}

export const userStractor = (req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined => {
  const { authToken } = req.cookies

  const decodedToken = jwt.verify(authToken, SECRET_WORD) as DecodedToken

  if (authToken === undefined || Object.keys(decodedToken)[0] === undefined) {
    return res.status(401).json({ error: 'No hay token o es invalido' })
  }

  const { id } = decodedToken
  req.userId = id

  next()
}
