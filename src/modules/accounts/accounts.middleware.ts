import { NextFunction, Request, Response } from 'express'
import { prisma } from '../../../prismaClient'

import { validateOrReject } from 'class-validator'
import { UpdateAccountDTO } from '../accounts/dtos/UpdateAccount.dto'
import { AuthUsers } from '@prisma/client'
import { AuthenticatedRequest } from '../../shared/interfaces/authenticatedRequest'

export class AccountsMiddleware {
	async validateUpdateAccountRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
		const updateAccountData = new UpdateAccountDTO(req.body)

		// validate DTO
		try {
			await validateOrReject(updateAccountData)
		} catch (error) {
			console.log(error)
			return res.status(500).send(error)
		}

		//Is this user allowed to update this account?
		const authUser = req.authUser as AuthUsers // user making request
		const account_id = parseInt(req.params.account_id, 10) // account to be updated

		const account = await prisma.accounts.findUnique({
			where: {
				account_id,
			},
			include: {
				authUser: {
					select: {
						user_id: true,
					},
				},
			},
		})

		if (account?.authUser.user_id !== authUser.user_id) {
			return res.status(500).send({ message: 'Unauthorized' })
		}

		next()
	}
}
