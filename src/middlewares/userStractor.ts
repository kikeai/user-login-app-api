import jwt from 'jsonwebtoken'
import { type Request, type Response, type NextFunction } from 'express'
import { type DecodedToken } from '../types'

export const userStractor = (req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined => {
  const { authToken } = req.cookies

  const decodedToken = jwt.verify(authToken, '123') as DecodedToken

  if (authToken === undefined || Object.keys(decodedToken)[0] === undefined) {
    return res.status(401).json({ error: 'No hay token o es invalido' })
  }

  const { id } = decodedToken
  req.userId = id

  next()
}
