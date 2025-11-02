import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'


export const validate = (schema: ZodSchema<any>) => (req: Request, _res: Response, next: NextFunction) => {
const data = {
body: req.body,
query: req.query,
params: req.params,
}
const result = schema.safeParse(data)
if (!result.success) {
const err: any = new Error('Validation error')
err.status = 400
err.details = result.error.flatten()
return next(err)
}
// attach parsed to request for downstream usage if needed
;(req as any).parsed = result.data
next()
}