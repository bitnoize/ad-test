import express, { Application, ErrorRequestHandler } from 'express'
import { HttpError } from 'http-errors'
import { AppOptions, Controller } from './interfaces/app.js'
import { MainController } from './controllers/main.js'
import { logger } from './logger.js'

export class App {
  private app: Application
  private controllers: Controller[] = []

  constructor(private readonly options: AppOptions) {
    this.app = express()

    this.app.disable('x-powered-by')
    this.app.disable('etag')

    this.app.use(express.json())

    // Controllers
    this.controllers.push(new MainController(this.options))

    this.controllers.forEach((controller) => this.app.use(controller.router))

    this.app.use(this.notFoundHandler)
    this.app.use(this.exceptionHandler)

    logger.info(`App initialized`)
  }

  listen(): void {
    const { serverPort } = this.options

    this.app.listen(serverPort, () => {
      logger.info(`App started and listening on ${serverPort} port`)
    })
  }

  private notFoundHandler: RequestHandler = (req, res) => {
    res.status(404).send({
      message: 'Not Found'
    })
  }

  private exceptionHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (res.headersSent) {
      return next(error)
    }

    if (error instanceof HttpError) {
      res.status(error.statusCode).send({
        message: error.message
      })
    } else {
      logger.error(error.stack)

      res.status(500).send({
        message: 'Internal Server Error'
      })
    }
  }
}
