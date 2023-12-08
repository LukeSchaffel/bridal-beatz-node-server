import { Request, Response } from 'express'
import { prisma } from '../../prismaClient'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

import { SignupDTO } from './dtos/signup.dto'

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
			})

			res.json(newUser)
		} catch (error) {
			res.send(error)
		}
	}
}
