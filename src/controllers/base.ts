import { Router } from 'express'
import { AppOptions, Controller } from '../interfaces/app.js'
import { RedisService } from '../services/redis.js'
import { TrendingService } from '../services/trending.js'

export abstract class BaseController implements Controller {
  router: Router

  protected redisService = RedisService.instance()
  protected trendingService = TrendingService.instance()

  constructor(protected readonly options: AppOptions) {
    this.router = Router()
  }
}
