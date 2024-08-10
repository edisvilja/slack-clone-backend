import { WebSocketServer } from 'ws';

export default function createWebsocketServer (server, logger) {
  // Create websocket server without own http server
  const websocketServer = new WebSocketServer({ noServer: true })

  // Handle WebSocket connections
  websocketServer.on('connection', (client) => {
    logger.info('New WebSocket connection')

    client.on('message', (message) => {
      logger.info(`Received message: ${message}`)
      client.send(`Echo: ${message}`)
    })

    client.on('close', () => {
      logger.info('WebSocket connection closed');
    })

    client.on('error', (error) => {
      logger.error(`WebSocket error: ${error.message}`)
    })
  })

  // Integrate WebSocket server with existing HTTP server
  server.on('upgrade', (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (ws) => {
      websocketServer.emit('connection', ws, request)
    })
  })

  return websocketServer
}