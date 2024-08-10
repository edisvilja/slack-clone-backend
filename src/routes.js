export const helloRoute = (app, logger) => app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

export const errorRoute = (app, logger) => app.get('/error', (req, res) => {
  throw new Error('Something went wrong!');
})