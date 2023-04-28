import { type Request, type Response, type NextFunction } from 'express'

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  console.log(error.name)
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'No hay token o es invalido' })
  } else if (error.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Token expirado' })
  } else {
    res.status(500).end()
  }
}
