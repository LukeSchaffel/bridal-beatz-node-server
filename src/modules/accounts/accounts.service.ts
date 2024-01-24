import { prisma } from '../../../prismaClient'
import { Accounts } from '@prisma/client'

export class AccountsService {
	static async getAverageRating(account_id: Accounts['account_id']) {
		try {
			const reviews = await prisma.reviews.findMany({
				where: {
					account_id,
				},
				select: {
					rating: true,
				},
			})

			const average_rating = reviews.map((r) => r.rating).reduce((a, b) => a + b, 0) / reviews.length

			return { average_rating, total: reviews.length }
		} catch (error) {
			console.log(error)
			return { average_rating: 0, total: 0 }
		}
	}
}
