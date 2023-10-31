import '@app-config/main'

export interface Config {
  serverPort: number
  redisUrl: string
  proxyUrl: string
  requestTimeout: number
}

declare module '@app-config/main' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface ExportedConfig extends Config {}
}
