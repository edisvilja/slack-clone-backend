import { WebSocketServer } from 'ws'
import * as websocketHandlers from '../websocket/handlers'
import { jsonMiddleware as parseJson } from '../websocket/middleware'

export default function setupWebsocketServer(server) {
  const websocketServer = createWebsocketServer(server)
  initializeWebsocketServer(websocketServer)
  logger.info("Initialized Websocket Server")
  return websocketServer
}

function createWebsocketServer (server) {
  // Create websocket server without own http server
  const websocketServer = new WebSocketServer({ noServer: true })

  // Integrate WebSocket server with existing HTTP server
  server.on('upgrade', (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (ws) => {
      websocketServer.emit('connection', ws, request)
    })
  })

  return websocketServer
}

function initializeWebsocketServer(websocketServer) {
  // Handle WebSocket connections
  websocketServer.on('connection', (client) => {
    logger.info('New WebSocket connection')

    client.on('message', (message) => {
      parseJson({ message, client, websocketServer }, (enhancedContext) => {
        // Handle the message with the provided handlers
        Object.values(websocketHandlers).forEach(handler => {
          handler(enhancedContext)
        })
      })
    })

    client.on('close', () => {
      logger.info('WebSocket connection closed')
    })

    client.on('error', (error) => {
      logger.error(`WebSocket error: ${error.message}`)
    })
  })
}