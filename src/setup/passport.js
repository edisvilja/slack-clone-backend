// /config/passport.js
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as AppleStrategy } from 'passport-apple'
import { handleGoogleCallback } from '../services/auth/googleAuthService'
import { handleGithubCallback } from '../services/auth/githubAuthService'
import { handleAppleCallback } from '../services/auth/appleAuthService'

export default function setupPassport() {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { authUser, jwtToken } = await handleGoogleCallback(accessToken, refreshToken, profile)
      done(null, { authUser, jwtToken })
    } catch (err) {
      done(err)
    }
  }))

  passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { authUser, jwtToken } = await handleGithubCallback(accessToken, refreshToken, profile)
      done(null, { authUser, jwtToken })
    } catch (err) {
      done(err)
    }
  }))
  
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyString: process.env.APPLE_PRIVATE_KEY,
    callbackURL: `${process.env.BASE_URL}/auth/apple/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { authUser, jwtToken } = await handleAppleCallback(accessToken, refreshToken, profile)
      done(null, { authUser, jwtToken })
    } catch (err) {
      done(err)
    }
  }))
  
  passport.serializeUser((user, done) => {
    done(null, user.authUser._id)
  })
  
  passport.deserializeUser(async (id, done) => {
    try {
      const authUser = await findOrCreateAuthUser(null, null, null)  // Modify if needed to get the user
      done(null, authUser)
    } catch (err) {
      done(err)
    }
  })
}