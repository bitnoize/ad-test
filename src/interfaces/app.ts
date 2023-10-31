import { Router, RequestHandler } from 'express'

export interface AppOptions {
  serverPort: number
}

export interface Controller {
  router: Router
}

export type ControllerClass = new (options: AppOptions) => Controller

export type RequestBodyHandler<T> = RequestHandler<object, object, T>

export interface AuthRequest {
  session: string
}
