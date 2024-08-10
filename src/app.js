import express from 'express'

import { helloRoute, errorRoute } from './routes.js'
import { logErrors } from './middleware.js'

import createLogger from './logger.js'
import createWebsocketServer from './websocketServer.js'

// TODO: maybe add config (port, server/websocketServer disable)

export default function createApp(otherPort) {
  const logger = createLogger()
  const expressApp = express()
  const port = otherPort || process.env.PORT || 3000

  // Routes
  helloRoute(expressApp, logger)
  errorRoute(expressApp, logger)


  // Middleware
  logErrors(expressApp, logger)


  // Expose http server
  const server = expressApp.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`)
  })

  // Create websocket server using existing http server
  const websocketServer = createWebsocketServer(server, logger)

  return { expressApp, logger, server, websocketServer }
}