import { RequestHandler } from 'express'
import createError from 'http-errors'
import { BaseController } from './base.js'
import { AppOptions, RequestBodyHandler, AuthRequest } from '../interfaces/app.js'
import { isAuthRequest } from '../helpers.js'
import { logger } from '../logger.js'

export class MainController extends BaseController {
  constructor(options: AppOptions) {
    super(options)

    this.router.post('/auth', this.createAuthHandler)
    this.router.get('/balance', this.readBalanceHandler)

    logger.info(`MainController registered`)
  }

  createAuthHandler: RequestBodyHandler<AuthRequest> = async (
    req,
    res,
    next
  ): Promise<void> => {
    try {
      if (!req.is('application/json')) {
        return next(new createError.NotAcceptable())
      }

      if (!isAuthRequest(req.body)) {
        return next(new createError.BadRequest())
      }

      await this.redisService.saveSession(req.body.session)

      res.status(201).json({
        success: true
      })
    } catch (error) {
      next(error)
    }
  }

  readBalanceHandler: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const session = await this.redisService.loadSession()

      if (session == null) {
        return next(new createError.Locked())
      }

      const profile = await this.trendingService.getProfile(session)

      if (profile == null) {
        return next(new createError.BadRequest())
      }

      res.status(200).json({
        success: true,
        balance: profile.balance
      })
    } catch (error) {
      next(error)
    }
  }
}
