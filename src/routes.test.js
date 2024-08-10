import {jest} from '@jest/globals'

import request from 'supertest'
import createApp from './app.js'

describe('Routes', () => {
  let app

  beforeEach(() => {
    app = createApp(3030)
  });

  afterEach(() => {
    app.server.close()
    app.websocketServer.close()
    jest.restoreAllMocks()
  })

  it('should return Hello from Express for /', async () => {
    const response = await request(app.expressApp).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Hello from Express!')
  })

  it('should return 500 and error message for /error', async () => {
    const response = await request(app.expressApp).get('/error')
    expect(response.status).toBe(500)
    expect(response.text).toBe('Something broke!')
  })
})