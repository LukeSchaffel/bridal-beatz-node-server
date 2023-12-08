import { Router } from 'express'
import { AuthController } from './auth.controller'
import { AuthMiddleware } from './auth.middleware'

export class AuthModule {
	controller: AuthController
	middleware: AuthMiddleware

	constructor() {
		this.controller = new AuthController()
		this.middleware = new AuthMiddleware()
	}

	getRoutes(): Router {
		const router = Router()
		router.post('/signup', this.middleware.validateSignupRequest, this.controller.signUp)
		router.post('/login', this.middleware.validateLoginRequest, this.controller.loginUser)
		return router
	}
}
