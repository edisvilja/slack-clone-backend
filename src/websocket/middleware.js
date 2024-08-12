export function jsonMiddleware({ message, client, websocketServer }, next) {
  try {
    const parsedMessage = JSON.parse(message)

    // Attach the parsed message to the `message` property for further handling
    const enhancedContext = { object: parsedMessage, client, websocketServer }

    client.sendJSON = (object) => client.send(JSON.stringify(object))
    
    // Call the next handler with the enhanced context
    next(enhancedContext);
  } catch (error) {
    client.send(JSON.stringify({ error: 'Invalid JSON' }))
    client.close() // Optionally close the connection if JSON is invalid
  }
}