import express from 'express'
import logger from './logger.js'
import { helloRoute, errorRoute } from './routes.js'
import { logErrors } from './middleware.js'
import createWebsocketServer from './websocketServer.js'

const app = express()
const port = process.env.PORT || 3000

// Routes
helloRoute(app, logger)
errorRoute(app, logger)


// Middleware
logErrors(app, logger)


// Expose http server
const server = app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`)
})

// Create websocket server
const websocketServer = createWebsocketServer(server, logger)