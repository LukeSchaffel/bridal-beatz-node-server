import { Request, Response } from 'express'
import { prisma } from '../../prismaClient'
import { AuthUsers } from '@prisma/client'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

export class AuthService {
	static async login(id: AuthUsers['user_id']) {
		try {
			const user = await prisma.authUsers.findUnique({
				where: {
					user_id: id,
				},
				select: {
					first_name: true,
					last_name: true,
					email: true,
					is_admin: true,
					accounts: {
						select: {
							first_name: true,
							last_name: true,
							email: true,
							type: true,
						},
					},
				},
			})
			const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

			return { user, token }
		} catch (error) {
      console.log('something went wrong')
    }
	}
}
