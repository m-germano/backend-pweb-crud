import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import routes from './routes'
import { notFound } from './middlewares/notFound'
import { errorHandler } from './middlewares/errorHandler'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


app.get('/health', (_req, res) => res.json({ status: 'ok' }))


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/docs.json', (_req, res) => res.json(swaggerSpec))


app.use('/api', routes)


app.use(notFound)
app.use(errorHandler)

export default app
