export default function exposeHttpServer(expressApp) {
  return expressApp.listen(process.env.PORT, () => {
    logger.info(`Server is running on http://localhost:${process.env.PORT}`)
  })
}
