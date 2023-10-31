import { Redis } from 'ioredis'
import { RedisServiceOptions } from '../interfaces/redis.js'
import { logger } from '../logger.js'

export class RedisService {
  private redis: Redis

  constructor(private readonly options: RedisServiceOptions) {
    const { redisUrl } = this.options

    this.redis = new Redis(redisUrl)

    logger.info(`RedisService initialized`)
  }

  private static _instance: RedisService | undefined

  static register(options: RedisServiceOptions, redisUrl: string) {
    if (this._instance !== undefined) {
      throw new Error(`RedisService object allready registered`)
    }

    this._instance = new RedisService(options, redisUrl)
  }

  static instance(): RedisService {
    if (this._instance === undefined) {
      throw new Error(`RedisService object does not registered`)
    }

    return this._instance
  }

  async saveSession(session: string): Promise<void> {
    await this.redis.set('session', session)
  }

  async loadSession(): Promise<string | null> {
    return await this.redis.get('session')
  }
}
