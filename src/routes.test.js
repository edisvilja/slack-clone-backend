import { expect, test, describe, beforeEach, afterEach, jest } from 'bun:test'

import request from 'supertest'
import bootstrapApp from './bootstrap'

describe('Routes', () => {
  let app

  beforeEach(() => {
    app = bootstrapApp(3030)
  })

  afterEach(() => {
    app.server.close()
    app.websocketServer.close()
    jest.restoreAllMocks()
  })

  test('should return Hello from Express for /', async () => {
    const response = await request(app.expressApp).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Hello from Express!')
  })

  test('should return 500 and error message for /error', async () => {
    const response = await request(app.expressApp).get('/error')
    expect(response.status).toBe(500)
    expect(response.text).toBe('Something broke!')
  })
})
