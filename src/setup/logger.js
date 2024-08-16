import winston from 'winston'

export default function setupLogger() {
  // Retrieve environment variables or set default values
  const defaultLogLevel = process.env.LOG_LEVEL || 'debug'
  const consoleLogLevel = process.env.CONSOLE_LOG_LEVEL || defaultLogLevel
  const fileLogLevel = process.env.FILE_LOG_LEVEL || 'info'
  const logToConsole = process.env.LOG_TO_CONSOLE !== 'false' // Default to true if not explicitly set to 'false'
  const logToFile = process.env.LOG_TO_FILE !== 'false'
  const logFilePath = process.env.LOG_FILE_PATH || 'app.log'

  // Create a list of transports based on environment variables
  const transports = []

  if (logToConsole) {
    transports.push(
      new winston.transports.Console({
        level: consoleLogLevel,
      })
    )
  }

  if (logToFile) {
    transports.push(
      new winston.transports.File({
        filename: logFilePath,
        level: fileLogLevel,
      })
    )
  }

  // Create the logger with the configured transports
  const logger = winston.createLogger({
    level: defaultLogLevel,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        return `${timestamp} [${level}]: ${message}${stack ? `\nStack: ${stack}` : ''} ${Object.keys(meta).length ? `\nMeta: ${JSON.stringify(meta)}` : ''}`
      })
    ),
    transports,
  })

  global.logger = logger
  return logger
}
