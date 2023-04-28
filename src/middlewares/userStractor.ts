import jwt from 'jsonwebtoken'
import { type Request, type Response, type NextFunction } from 'express'
import { type DecodedToken } from '../types'

export const userStractor = (req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined => {
  const authorization = req.get('authorization')
  let token = ''
  if (typeof authorization === 'string' && authorization?.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  // let decodedToken = {}

  const decodedToken = jwt.verify(token, '123') as DecodedToken
  // try {
  // } catch (error) {
  //   next(error)
  //   return
  // }

  if (token === '' || Object.keys(decodedToken)[0] === undefined) {
    return res.status(401).json({ error: 'No hay token o es invalido' })
  }

  const { id } = decodedToken
  req.userId = id

  next()
}
