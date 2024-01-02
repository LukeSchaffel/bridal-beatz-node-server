import { Router } from 'express'
import { AuthenticateUserMiddleware } from '../../shared/middleware/shared.middleware'
import { AccountController } from './accounts.controller'

export class AccountModule {
	controller: AccountController
	// middleware: AccountMiddleware

	constructor() {
		this.controller = new AccountController()
		// this.middleware = new AccountMiddleware()
	}

	getRoutes(): Router {
		const router = Router()

		router.patch('/update', AuthenticateUserMiddleware.applyMiddleware(), this.controller.updateAccount)

		return router
	}
}
