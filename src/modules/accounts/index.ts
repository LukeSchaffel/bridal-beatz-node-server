import { Router } from 'express'
import { AuthenticateUserMiddleware } from '../../shared/middleware/shared.middleware'
import { AccountsController } from './accounts.controller'
import { AccountsMiddleware } from './accounts.middleware'

export class AccountsModule {
	controller: AccountsController
	middleware: AccountsMiddleware

	constructor() {
		this.controller = new AccountsController()
		this.middleware = new AccountsMiddleware()
	}

	getRoutes(): Router {
		const router = Router()

		router.patch('/update', AuthenticateUserMiddleware.applyMiddleware(), this.controller.updateAccount)
		router.patch(
			'/updateAccount/:account_id',
			AuthenticateUserMiddleware.applyMiddleware(),
			this.middleware.validateUpdateAccountRequest,
			this.controller.updateAccount
		)
		router.get('/accounts', AuthenticateUserMiddleware.applyMiddleware(), this.controller.listAccounts)
		return router
	}
}
