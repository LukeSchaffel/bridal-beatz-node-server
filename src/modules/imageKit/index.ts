import { Router } from 'express'
import { ImageKitController } from './imageKit.controller'
import { AuthenticateUserMiddleware } from '../../shared/middleware/shared.middleware'

export class ImageKitModule {
	controller: ImageKitController

	constructor() {
		this.controller = new ImageKitController()
	}

	getRoutes() {
		const router = Router()
		router.post(
			'/uploadImage/:account_id',
			AuthenticateUserMiddleware.applyMiddleware(),
			this.controller.uploadImage
		)
		return router
	}
}
