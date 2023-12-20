import { NextFunction, Request, Response } from 'express'
import { prisma } from '../../../prismaClient'
const bcrypt = require('bcrypt')

import { SignupDTO } from './dtos/signup.dto'
import { LoginDTO } from './dtos/login.dto'
import { validateOrReject } from 'class-validator'

export class AuthMiddleware {
	async validateSignupRequest(req: Request, res: Response, next: NextFunction) {
		const data = new SignupDTO(req.body)

		//validate dto
		try {
			await validateOrReject(data)
		} catch (err) {
			return res.status(400).send({ message: 'Invalid signup details' })
		}

		//reject if passwords dont match
		if (data.password !== data.password2) {
			return res.status(400).send({ message: 'Passwords must match' })
		}

		//reject if email is in wrong format
		const validatedEmail = String(req.body.email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		if (!validatedEmail) {
			return res.status(501).send({ message: 'Please Enter a Valid Email Address' })
		}

		//reject if email already exists
		const existingUser = await prisma.authUsers.findUnique({
			where: {
				email: data.email.toLowerCase(),
			},
		})
		if (!!existingUser) {
			return res.status(400).send({
				message: 'An account with that email already exits',
			})
		}

		//reject if user is trying to make admin account
		if (data.type === 'admin') {
			return res.status(401).send({ message: 'Unauthorized' })
		}

		next()
	}

	async validateLoginRequest(req: Request, res: Response, next: NextFunction) {
		const loginData = new LoginDTO(req.body)

		//validate dto
		try {
			await validateOrReject(loginData)
		} catch (err) {
			return res.status(400).send({ message: JSON.stringify(err) })
		}

		//validate password
		const user = await prisma.authUsers.findUnique({
			where: {
				email: loginData.email,
			},
		})

		if (!user) {
			return res.status(500).send({ messagae: 'Invalid email or password' })
		}

		try {
			if (await bcrypt.compare(req.body.password, user?.password_hash)) {
				next()
			} else {
				return res.status(500).send({ message: 'Invalid email or Password' })
			}
		} catch (error) {
			res.status(500).send({ message: 'Invalid email or password' })
		}
	}
}
