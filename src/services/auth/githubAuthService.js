import User from '../../models/userModel'
import jwt from 'jsonwebtoken'

export const handleGithubCallback = async (accessToken, refreshToken, profile) => {
  const email = profile.emails ? profile.emails[0].value : null
  const githubId = profile.id
  const avatarUrl = profile.photos[0].value || `https://eu.ui-avatars.com/api/?name={profile.displayName}&size=250`
  
  let user = await User.findOne({ email })

  if (!user) {
    user = new User({ email, name: profile.displayName, avatarUrl }) // Avatar-URL speichern
    await user.save()
  } else if (!user.avatarUrl) {
    user.avatarUrl = avatarUrl
    await user.save()
  }

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '365d' })
  return { jwtToken }
}