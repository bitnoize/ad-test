import { config, loadConfig } from '@app-config/main'
import { RedisService } from './services/redis.js'
import { TrendingService } from './services/trending.js'
import { App } from './app.js'

export const bootstrap = async (): Promise<void> => {
  await loadConfig()

  const { serverPort, redisUrl, proxyUrl, requestTimeout } = config

  RedisService.register({
    redisUrl
  })

  TrendingService.register({
    proxyUrl,
    requestTimeout
  })

  const app = new App({
    serverPort
  })

  app.listen()
}

bootstrap().catch((error) => {
  console.error(error.stack)

  process.exit(1)
})
