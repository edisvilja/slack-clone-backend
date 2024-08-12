export const helloRoute = (expressApp) => expressApp.get('/', (req, res) => {
  res.send('Hello from Express!');
});

export const errorRoute = (expressApp) => expressApp.get('/error', (req, res) => {
  throw new Error('Something went wrong!');
})