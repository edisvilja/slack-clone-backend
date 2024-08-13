import nodemailer from "nodemailer"

export async function sendMail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  }

  await mailer.sendMail(mailOptions)
}


/*
    mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: "laskmailer@gmail.com",
      subject: "Message title",
      text: "Plaintext version of the message",
      html: "<p>HTML version of the message</p>",
    })
  */