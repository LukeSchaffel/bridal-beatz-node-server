import { prisma } from '../../../prismaClient'
import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest'
import { AuthUsers } from '@prisma/client'

export class AuthenticateUserMiddleware {
	static applyMiddleware() {
		return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
			try {
				const authHeader = req.header('authorization')
				if (!authHeader) throw new Error()
				jwt.verify(authHeader?.split(' ')[1], process.env.ACCESS_TOKEN_SECRET as Secret, async (err, data) => {
					if (err) {
						// Token is invalid, send a 403 Forbidden response
						return res.status(403).send({ message: 'Forbidden' })
					}
					if (data) {
						const authUser = await prisma.authUsers.findFirst({
							where: { user_id: (data as any).authUser.user_id },
							select: { user_id: true },
						})

						req.authUser = authUser as AuthUsers
						next()
					}
				})
			} catch (error) {
				console.log(error)
				return res.status(403).send({ message: 'Forbidden' })
			}
		}
	}
}
