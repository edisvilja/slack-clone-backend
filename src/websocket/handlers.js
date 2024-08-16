// expects json middleware

export const pingPong = async ({ object, client, websocketServer }) => {
  if (object?.type == 'ping') {
    client.sendJSON({ type: 'pong', reply_to: object?.id || null })
  }
}
