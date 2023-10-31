import got, { Got, Method } from 'got'
import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent'
import { TrendingServiceOptions, ProfileResponse } from '../interfaces/trending.js'
import { TRENDING_BASE_URL } from '../constants.js'
import { isProfileResponse } from '../helpers.js'
import { logger } from '../logger.js'

export class TrendingService {
  private got: Got

  constructor(private readonly options: TrendingServiceOptions) {
    const { proxyUrl, requestTimeout } = this.options

    if (!proxyUrl.match(/^(http|https):/)) {
      throw new Error(`Support only HTTP or HTTPS proxies`)
    }

    const proxyAgentOptions = {
      proxy: proxyUrl
    }

    this.got = got.extend({
      agent: {
        https: new HttpsProxyAgent(proxyAgentOptions),
        http: new HttpProxyAgent(proxyAgentOptions)
      },
      setHost: true,
      responseType: 'json',
      followRedirect: false,
      timeout: {
        request: requestTimeout
      },
      retry: {
        limit: 0
      }
    })

    logger.info(`TrendingService initialized`)
  }

  private static _instance: TrendingService | undefined

  static register(options: TrendingServiceOptions) {
    if (this._instance !== undefined) {
      throw new Error(`TrendingService object allready registered`)
    }

    this._instance = new TrendingService(options)
  }

  static instance(): TrendingService {
    if (this._instance === undefined) {
      throw new Error(`TrendingService object does not registered`)
    }

    return this._instance
  }

  async getProfile(session: string): Promise<ProfileResponse | null> {
    try {
      const response = await this.got({
        method: 'GET' as Method,
        url: new URL('/api/user/getprofile', TRENDING_BASE_URL),
        headers: {
          cookie: `PHPSESSID=${session}`
        }
      })

      if (!isProfileResponse(response.body)) {
        throw new Error(`Trending response validation failed`)
      }

      const profile: ProfileResponse = {
        balance: response.body.data.balance
      }

      return profile
    } catch (error) {
      logger.error(`Transfer request error: ${error.message}`)
      return null
    }
  }
}
