import { Request, Response } from 'express'
import { prisma } from '../../../prismaClient'

import { AuthenticatedRequest } from '../../shared/interfaces/authenticatedRequest'
import { UpdateAccountDTO } from './dtos/UpdateAccount.dto'
import { Locations } from '@prisma/client'
import { ListAccountsDTO } from './dtos/ListAccounts.dto'

export class AccountsController {
	async updateAccount(req: AuthenticatedRequest, res: Response) {
		try {
			const account_id = parseInt(req.params.account_id, 10)
			const reqData = new UpdateAccountDTO(req.body)

			const { first_name, last_name, phone, vendor_type, client_type, genre, locations, links, bio, about_me } = reqData

			const updatedAccount = await prisma.accounts.update({
				where: { account_id },
				data: {
					first_name,
					last_name,
					phone,
					vendor_type,
					client_type,
					genre,
					bio,
					about_me,
				},
			})

			// Delete locations that are not in the form
			const idsToDelete: number[] = []
			locations?.forEach((l) => {
				if (l.location_id) {
					idsToDelete.push(l.location_id)
				}
			})
			const deletedLocations = await prisma.locations.deleteMany({
				where: {
					account_id,
					NOT: {
						location_id: {
							in: idsToDelete,
						},
					},
				},
			})

			const createdAndUpdatedLocations = await Promise.all(
				(locations || []).map(async (l: any) => {
					if (l.location_id) {
						// If location has an ID, update it
						return prisma.locations.update({
							where: { location_id: l.location_id },
							data: {
								city: l.city as string,
								state: l.state as string,
								zip: l.zip as string,
							},
						})
					} else {
						// If location doesn't have an ID, create a new one
						try {
							return prisma.locations.create({
								data: {
									city: l.city as string,
									state: l.state as string,
									zip: l.zip as string,
									location_id: undefined,
									account: { connect: { account_id } },
								},
							})
						} catch (error) {
							console.log(error)
						}
					}
				})
			)

			//get refreshed account
			const refreshedAccount = await prisma.accounts.findUnique({
				where: { account_id },
				select: {
					account_id: true,
					phone: true,
					first_name: true,
					last_name: true,
					email: true,
					type: true,
					vendor_type: true,
					client_type: true,
					genre: true,
					locations: true,
					links: true,
					about_me: true,
					bio: true,
				},
			})

			res.status(200).json({ data: refreshedAccount })
		} catch (error) {
			res.status(500).send(error)
		}
	}

	async listAccounts(req: AuthenticatedRequest, res: Response) {
		try {
			const queryData = new ListAccountsDTO(req.query)
			const { type, client_type, vendor_type } = queryData

			const accounts = await prisma.accounts.findMany({
				where: {
					...(type ? { type } : {}),
					...(vendor_type ? { vendor_type } : {}),
					...(client_type ? { client_type } : {}),
				},
				select: {
					account_id: true,
					phone: true,
					first_name: true,
					last_name: true,
					email: true,
					type: true,
					vendor_type: true,
					client_type: true,
					genre: true,
					locations: true,
					links: true,
					about_me: true,
					bio: true,
				},
			})

			res.status(200).json({ data: accounts })
		} catch (error) {
			res.status(500).send(error)
		}
	}
}
