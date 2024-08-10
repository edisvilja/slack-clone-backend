export const helloRoute = (expressApp, logger) => expressApp.get('/', (req, res) => {
  res.send('Hello from Express!');
});

export const errorRoute = (expressApp, logger) => expressApp.get('/error', (req, res) => {
  throw new Error('Something went wrong!');
})