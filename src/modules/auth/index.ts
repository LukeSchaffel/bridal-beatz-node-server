import { Router } from 'express'
import { AuthController } from './auth.controller'
import { AuthMiddleware } from './auth.middleware'
import { AuthenticateUserMiddleware } from '../../shared/middleware/shared.middleware'

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
		router.post(
			'/login',
			this.middleware.validateLoginRequest,
			// AuthenticateUserMiddleware.applyMiddleware(),
			this.controller.loginUser
		)
		router.post('/refreshUser', AuthenticateUserMiddleware.applyMiddleware(), this.controller.refreshUser)
		router.patch('/updateAccount/:account_id', AuthenticateUserMiddleware.applyMiddleware(), this.controller.updateAccount)
		return router
	}
}
