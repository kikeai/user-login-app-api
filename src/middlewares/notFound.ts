import { type Request, type Response, type NextFunction } from 'express'

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).end()
}
