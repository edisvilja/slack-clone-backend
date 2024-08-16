// /controllers/authController.js
import { generateMagicLink, verifyMagicLink } from '../services/auth/mailAuthService'

export const sendMagicLink = async (req, res) => {
  try {
    const { email } = req.body
    await generateMagicLink(email)
    res.status(200).send('Magic Link sent!')
  } catch (error) {
    console.log(error)
    res.status(500).send('Error sending Magic Link')
  }
}

export const verifyMagicLinkHandler = async (req, res) => {
  try {
    const { token } = req.params
    const jwtToken = await verifyMagicLink(token)

    res.cookie('token', jwtToken, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })

    res.redirect('/')
  } catch (error) {
    res.status(400).send('Invalid or expired token')
  }
}

export const passportCallback = (req, res) => {
  const { jwtToken } = req.user
  res.cookie('token', jwtToken, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
  res.redirect('/')
}
