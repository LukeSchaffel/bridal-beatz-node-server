import { Request, Response } from 'express'
import { prisma } from '../../../prismaClient'

import { AuthenticatedRequest } from '../../shared/interfaces/authenticatedRequest'
import { UpdateAccountDTO } from './dtos/UpdateAccount.dto'

export class AccountController {
	async updateAccount(req: AuthenticatedRequest, res: Response) {
		try {
			const reqData = new UpdateAccountDTO(req.body)
		} catch (error) {
			res.status(500).send(error)
		}
	}
}
