import { create as createLogger } from '../utils/logger'
import { Request, Response, NextFunction } from 'express'
// import { Logger } from 'winston'

// declare module 'express' {
//   interface Request {
//     logger? : Logger
//   }
// }

export default function setLogger(req: Request, res: Response, next: NextFunction): void {
    req.logger = createLogger(`${req.traceId ?? '-'}`)
    next()
}
