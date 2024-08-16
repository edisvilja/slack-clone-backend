// /services/authService.js
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import AuthUser from '../../models/authUserModel'
import User from '../../models/userModel'
import { sendMail } from '../../utils/mailer'

export const generateMagicLink = async email => {
  const token = crypto.randomBytes(20).toString('hex')
  const expires = Date.now() + 3600000 // 1 Stunde gültig

  let authUser = await AuthUser.findOne({ email })

  if (!authUser) {
    authUser = new AuthUser({ email })
  }

  authUser.magicLinkToken = token
  authUser.magicLinkExpires = expires
  await authUser.save()

  const link = `${process.env.BASE_URL}/auth/mail/verify/${token}`
  await sendMail(email, 'Your Magic Link', `Click here to verify: ${link}`)

  return link
}

export const verifyMagicLink = async token => {
  const authUser = await AuthUser.findOne({
    magicLinkToken: token,
    magicLinkExpires: { $gt: Date.now() },
  })

  if (!authUser) {
    throw new Error('Invalid or expired token')
  }

  // Hier erstellen wir den echten Benutzer
  const avatarUrl = `https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg`
  let user = await User.findOne({ email: authUser.email })
  if (!user) {
    user = new User({ email: authUser.email, avatarUrl })
    await user.save()
  } else if (!user.avatarUrl) {
    user.avatarUrl = avatarUrl
    await user.save()
  }

  await authUser.deleteOne() // Optional: Entferne den Eintrag aus der authUser-Sammlung

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '365d',
  })

  return jwtToken
}
