import { Router } from 'express'
import { AuthenticateUserMiddleware } from '../../shared/middleware/shared.middleware'
import { ReviewsController } from './reviews.controller'

export class ReviewsModule {
	controller: ReviewsController

	constructor() {
		this.controller = new ReviewsController()
	}

	getRoutes(): Router {
		const router = Router()
		router.get('/:account_id', AuthenticateUserMiddleware.applyMiddleware(), this.controller.getReviews)
		router.post('/:account_id', AuthenticateUserMiddleware.applyMiddleware(), this.controller.createReview)

		return router
	}
}
