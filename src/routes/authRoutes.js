// /routes/authRoutes.js
import express from 'express'
import passport from 'passport'
import { sendMagicLink, verifyMagicLinkHandler } from '../controllers/authController'
import { passportCallback } from '../controllers/authController'

const router = express.Router()

router.post('/mail', sendMagicLink)
router.get('/mail/verify/:token', verifyMagicLinkHandler)

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

router.get('/google/callback', passport.authenticate('google', { session: false }), passportCallback)

/*
// GitHub OAuth routes
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}))

router.get('/github/callback', passport.authenticate('github', { session: false }), passportCallback)


// Apple OAuth routes
router.get('/apple', passport.authenticate('apple'))

router.post('/apple/callback', passport.authenticate('apple', { session: false }), passportCallback)
*/

export default router
