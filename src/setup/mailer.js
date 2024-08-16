import nodemailer from 'nodemailer'

export default function setupMailer() {
  const mailer = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  mailer.verify((error, success) => {
    if (error) {
      logger.error(error)
    } else {
      logger.info('Mail client connected')
    }
  })

  global.mailer = mailer

  return mailer
}
