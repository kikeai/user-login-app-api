import { type Request, type Response, type NextFunction } from 'express'

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  console.log(error.name)
  res.status(400).json({ error: error.name })
}
