import express from 'express'

import { helloRoute, errorRoute } from './routes'
import { logErrors } from './middleware/post-routes'

import setupLogger from './setup/logger'
import setupWebsocketServer from './setup/websocketServer'
import { connectToMongoDb } from './setup/mongoDb'
import exposeHttpServer from './setup/exposeHttp'
import setupMailer from './setup/mailer'

// TODO: maybe add config (port, server/websocketServer disable)

export default async function bootstrapApp(otherPort) {
  const logger = setupLogger()
  const expressApp = express()
  const mongClient = await connectToMongoDb()
  const mailer = setupMailer()

  // Pre-routes middleware
  expressApp.use(express.json())

  // Routes
  helloRoute(expressApp)
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