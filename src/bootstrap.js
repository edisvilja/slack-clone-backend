import express from 'express'

import { helloRoute, errorRoute } from './routes'
import { logErrors } from './middleware/post-routes'

import setupLogger from './setup/logger'
import setupWebsocketServer from './setup/websocketServer'
import { connectToMongoDb } from './setup/mongoDb'
import exposeHttpServer from './setup/exposeHttp'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import cookieParser from 'cookie-parser'
import setupMailer from './setup/mailer'
import setupPassport from "./setup/passport"

export default async function bootstrapApp(otherPort) {
  const logger = setupLogger()
  const expressApp = express(); logger.info("Express App booting")
  const mongClient = await connectToMongoDb()
  const mailer = setupMailer()
  setupPassport()

  // Pre-routes middleware
  expressApp.use(express.json())
  expressApp.use(cookieParser())

  // Routes
  expressApp.use('/auth', authRoutes)
  expressApp.use('/api/user', userRoutes)
  errorRoute(expressApp)


  // Post-routes middleware
  logErrors(expressApp)

  // Expose http server
  process.env.PORT = otherPort || process.env.PORT || 3000
  const server = exposeHttpServer(expressApp)

  // Create websocket server using existing http server
  const websocketServer = setupWebsocketServer(server)

  return { expressApp, logger, server, websocketServer }
}