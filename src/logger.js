import winston from 'winston'

// Erstelle eine Winston Logger-Instanz
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      return `${timestamp} [${level}]: ${message}${stack ? `\nStack: ${stack}` : ''} ${Object.keys(meta).length ? `\nMeta: ${JSON.stringify(meta)}` : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Loggt auf die Konsole
    new winston.transports.File({ filename: 'combined.log' }) // Loggt in eine Datei
  ],
})

export default logger