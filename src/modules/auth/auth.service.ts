import { Request, Response } from 'express'
import { prisma } from '../../../prismaClient'
import { AuthUsers } from '@prisma/client'
import jwt, { Secret } from 'jsonwebtoken'

import { AuthSelectors } from './selectors/auth.selectors'

export class AuthService {
	static async login(id: AuthUsers['user_id']) {
		try {
			const authUser = await prisma.authUsers.findUnique({
				where: {
					user_id: id,
				},
				select: AuthSelectors.userWithAccount,
			})
			const token = jwt.sign({ authUser }, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '1h' })

			return { authUser, token }
		} catch (error) {
			console.log('something went wrong')
		}
	}
}
