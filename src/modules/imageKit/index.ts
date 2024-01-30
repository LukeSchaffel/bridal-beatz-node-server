import { Router } from 'express'
import { ImageKitController } from './imageKit.controller'
import { AuthenticateUserMiddleware } from '../../shared/middleware/shared.middleware'

import multer from 'multer'

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 100000000 },
	fileFilter: (req, files, cb) => {
		if (Array(files).every((file) => file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || 'image/gif'))
			return cb(null, true)
		return cb(null, false)
	},
}).single('image')

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
			(req, res, next) => {
				upload(req, res, (err) => {
					if (err) {
						res.status(400).send(err)
					}
					next()
				})
			},
			this.controller.uploadImage
		)
		return router
	}
}
