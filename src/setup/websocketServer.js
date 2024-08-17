import { WebSocketServer } from 'ws'
import jwt from 'jsonwebtoken'
import * as websocketHandlers from '../websocket/handlers'
import { jsonMiddleware as parseJson } from '../websocket/middleware'

export default function setupWebsocketServer(server) {
  const websocketServer = createWebsocketServer(server)
  initializeWebsocketServer(websocketServer)
  logger.info('Initialized Websocket Server')
  return websocketServer
}

function createWebsocketServer(server) {
  // WebSocket-Server ohne eigenen HTTP-Server erstellen
  const websocketServer = new WebSocketServer({ noServer: true })

  // WebSocket-Server in bestehenden HTTP-Server integrieren
  server.on('upgrade', (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, ws => {
      websocketServer.emit('connection', ws, request)
    })
  })

  return websocketServer
}

function initializeWebsocketServer(websocketServer) {
  websocketServer.on('connection', (client, request) => {
    const token = extractTokenFromRequest(request)

    if (!token) {
      client.close(1008, 'Token missing or invalid') // Policy Violation
      return
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        client.close(1008, 'Unauthorized') // Policy Violation
        return
      }

      // Benutzerinformationen an die Anfrage anhängen (ähnlich wie req.user)
      client.user = decoded

      logger.info(`New WebSocket connection from user: ${client.user.id}`)

      client.on('message', message => {
        parseJson({ message, client, websocketServer }, enhancedContext => {
          // Handle the message with the provided handlers
          Object.values(websocketHandlers).forEach(handler => {
            handler(enhancedContext)
          })
        })
      })

      client.on('close', () => {
        logger.info('WebSocket connection closed')
      })

      client.on('error', error => {
        logger.error(`WebSocket error: ${error.message}`)
      })
    })
  })
}

function extractTokenFromRequest(request) {
  // Extrahiere den JWT-Token aus den Cookies oder dem Authorization-Header
  const cookieHeader = request.headers['cookie']
  const authHeader = request.headers['authorization']

  let token = null

  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='))
    if (tokenCookie) {
      token = tokenCookie.split('=')[1]
    }
  }

  if (!token && authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '')
    }
  }

  return token
}
