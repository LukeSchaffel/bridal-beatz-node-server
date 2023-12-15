import { Request, Response } from 'express'
import { prisma } from '../../prismaClient'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

import { AuthService } from './auth.service'
import { SignupDTO } from './dtos/signup.dto'
import { LoginDTO } from './dtos/login.dto'

export class AuthController {
	async signUp(req: Request, res: Response) {
		try {
			const reqData = new SignupDTO(req.body)
			const salt = await bcrypt.genSalt()
			const hashedPassword = await bcrypt.hash(reqData.password, salt)

			const newUser = await prisma.authUsers.create({
				data: {
					first_name: reqData.first_name,
					last_name: reqData.last_name,
					email: reqData.email.toLowerCase(),
					is_admin: false,
					password_hash: hashedPassword,
					...(reqData.phone && { phone: reqData.phone }),
					accounts: {
						create: {
							first_name: reqData.first_name,
							last_name: reqData.last_name,
							email: reqData.email.toLowerCase(),
							type: reqData.type,
						},
					},
				},
				select: {
					first_name: true,
					last_name: true,
					email: true,
					is_admin: true,
					user_id: true,
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

			const { user, token } = (await AuthService.login(newUser.user_id)) ?? {}
			res.status(200).json({ user, token })
		} catch (error) {
			res.send(error)
		}
	}

	async loginUser(req: Request, res: Response) {
		const loginData = new LoginDTO(req.body)
		try {
			const userToLogin = await prisma.authUsers.findUnique({
				where: {
					email: loginData.email,
				},
				select: {
					user_id: true,
				},
			})
			if (userToLogin) {
				const { user, token } = (await AuthService.login(userToLogin.user_id)) ?? {}
				res.status(200).json({ user, token })
			}
		} catch (error) {
			res.status(500).send(error)
		}
	}
}
