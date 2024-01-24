import { Request, Response } from 'express'
import { prisma } from '../../../prismaClient'

import { AuthenticatedRequest } from '../../shared/interfaces/authenticatedRequest'
import { Accounts, Locations } from '@prisma/client'
import { CreateReviewDTO } from './dtos/CreateReview.dto'

export class ReviewsController {
	async getReviews(req: AuthenticatedRequest, res: Response) {
		const account_id = parseInt(req.params.account_id, 10)

		try {
			const reviews = await prisma.reviews.findMany({
				where: {
					account_id,
				},
			})

			const reviewsWithCreator = await Promise.all(
				reviews.map(async (review) => {
					return {
						...review,
						creator: await prisma.accounts.findFirst({
							where: { account_id: review.creator_id },
							select: {
								first_name: true,
								last_name: true,
								type: true,
								vendor_type: true,
								client_type: true,
							},
						}),
					}
				})
			)

			res.status(200).json({ data: reviewsWithCreator })
		} catch (error) {
			res.status(500).send(error)
		}
	}

	async createReview(req: AuthenticatedRequest, res: Response) {
		const reqData = new CreateReviewDTO(req.body)
		const account_id = parseInt(req.params.account_id, 10)
		const { authUser } = req
		const { rating, content } = reqData

		try {
			const creator = await prisma.accounts.findFirst({
				where: {
					authUser: {
						user_id: authUser?.user_id,
					},
				},
				select: {
					first_name: true,
					last_name: true,
					type: true,
					vendor_type: true,
					client_type: true,
					account_id: true,
				},
			})

			if (creator?.account_id) {
				const review = await prisma.reviews.create({
					data: {
						rating,
						content,
						creator_id: creator.account_id,
						account_id,
					},
				})
				const reviewWithCreator = {
					...review,
					creator,
				}
				res.status(200).json({ data: reviewWithCreator })
			}
		} catch (error) {
			console.log(error)
			res.status(500).send(error)
		}
	}
}
