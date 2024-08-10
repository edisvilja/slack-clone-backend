
export const logErrors = (app, logger) => app.use((err, req, res, next) => {
  logger.error(err)
  res.status(500).send('Something broke!')
})
