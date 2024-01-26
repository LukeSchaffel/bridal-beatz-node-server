import { Request, Response } from 'express'
import { prisma } from '../../../prismaClient'

import { AuthenticatedRequest } from '../../shared/interfaces/authenticatedRequest'
import { UpdateAccountDTO } from './dtos/UpdateAccount.dto'
import { Accounts, Locations } from '@prisma/client'
import { AccountsSelectors } from './accounts.selectors'
import { ListAccountsDTO, SORT_BY_ENUM } from './dtos/ListAccounts.dto'
import { AccountsService } from './accounts.service'
import axios from 'axios'
import { AuthSelectors } from '../auth/selectors/auth.selectors'
import { LoremIpsum } from 'lorem-ipsum'

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
				select: AccountsSelectors.account,
			})

			res.status(200).json({ data: refreshedAccount })
		} catch (error) {
			res.status(500).send(error)
		}
	}

	async listAccounts(req: AuthenticatedRequest, res: Response) {
		try {
			const queryData = new ListAccountsDTO(req.query)
			const { type, client_type, vendor_type, state, search, take, sort_by } = queryData
			const takeNum = parseInt(take || '0', 10)

			const ORS: {}[] = []
			if (search?.length) {
				const searchStrings = search
					.trim()
					.split(' ')
					.forEach((section) => {
						ORS.push({
							first_name: {
								contains: section,
								mode: 'insensitive',
							},
						})
						ORS.push({
							last_name: {
								contains: section,
								mode: 'insensitive',
							},
						})
						ORS.push({
							bio: {
								contains: section,
								mode: 'insensitive',
							},
						})
					})
			}

			const accounts = await prisma.accounts.findMany({
				where: {
					...(type ? { type } : {}),
					...(vendor_type ? { vendor_type } : {}),
					...(client_type ? { client_type } : {}),
					...(state ? { locations: { some: { state } } } : {}),
					...(search
						? {
								OR: ORS,
						  }
						: {}),
				},
				select: AccountsSelectors.account,
			})

			const accountsWithAverageRating = await Promise.all(
				accounts.map(async (acc) => {
					return {
						...acc,
						rating: await AccountsService.getAverageRating(acc.account_id),
					}
				})
			)

			let returnAccounts: any = accountsWithAverageRating

			if (sort_by) {
				if (sort_by === 'score') {
					const usersAccount = await prisma.accounts.findFirst({
						where: {
							user_id: req.authUser?.user_id,
						},
						select: {
							genre: true,
							locations: true,
						},
					})

					const myGenre = new Set(usersAccount?.genre || [])
					const myStates = new Set(usersAccount?.locations.map((l) => l.state) || [])
					const myCities = new Set(usersAccount?.locations.map((l) => l.city) || [])

					const accountsWithScores = accountsWithAverageRating
						.map((acc) => {
							const intersection = []
							const { locations, genre } = acc
							locations.forEach((l) => {
								if (myCities.has(l.city)) {
									intersection.push(l)
								}
								if (myStates.has(l.state)) {
									intersection.push(l)
								}
							})
							genre.forEach((g) => {
								if (myGenre.has(g)) {
									intersection.push(g)
								}
							})
							return {
								...acc,
								score: intersection.length,
							}
						})
						.sort((a, b) => b.score - a.score)
						.map(({ score, ...rest }) => rest)

					returnAccounts = accountsWithScores
				} else {
					returnAccounts = [...accountsWithAverageRating].sort((a: any, b: any) => {
						return (b?.rating[sort_by] ? b?.rating[sort_by] : 0) - (a?.rating[sort_by] ? a?.rating[sort_by] : 0)
					})
				}
			}

			//Reccomended filter
			//get users locations and genres.
			//Create algo to go through each account and assign a score based on matching locaitons and genres.

			const pagedAccounts = takeNum > 0 ? returnAccounts.slice(0, takeNum) : returnAccounts

			res.status(200).json({ data: pagedAccounts })
		} catch (error) {
			res.status(500).send(error)
		}
	}

	async getSingleAccount(req: AuthenticatedRequest, res: Response) {
		try {
			const account_id = parseInt(req.params.account_id, 10)

			const account = await prisma.accounts.findFirst({
				where: { account_id },
				select: AccountsSelectors.account,
			})

			if (!account) {
				throw new Error()
			}
			const accountWithRating = {
				...account,
				rating: await AccountsService.getAverageRating(account.account_id),
			}
			res.status(200).json({ data: accountWithRating })
		} catch (error) {
			res.status(500).send(error)
		}
	}

	async botSignupVendor(req: Request, res: Response) {
		try {
			let count = parseInt(req?.params?.count || '1', 10)
			const promises = []
			for (let i = 0; i < count; i++) {
				console.log('Creating bot', i)
				const { data } = await axios.get('http://api.namefake.com')
				const first_name = data.name.split(' ')[0]
				const last_name = data.name.split(' ')[1]
				const phone = data.phone_h
				const email = `${data.email_u}@${data.email_d}`
				const genre = [
					'pop',
					'rock',
					'rap',
					'hiphop',
					'country',
					'randb',
					'jazz',
					'electronic',
					'funk',
					'reggae',
					'disco',
					'classical',
					'church',
				]
					.sort(() => 0.5 - Math.random())
					.slice(0, 3)
				const address = data.address.split('\n')
				const cityStateZip = address[1]
				const stateZip = cityStateZip.split(',')[1].trim()
				const city = cityStateZip.split(',')[0]
				const state = stateZip.split(' ')[0]
				const zip = stateZip.split(' ')[1].split('-')[0]
				const lorem = new LoremIpsum({
					sentencesPerParagraph: {
						max: 8,
						min: 4,
					},
					wordsPerSentence: {
						max: 16,
						min: 4,
					},
				})

				const about_me = lorem.generateParagraphs(3)

				try {
					const newUserPromise = prisma.authUsers.create({
						data: {
							first_name,
							last_name,
							email,
							is_admin: false,
							password_hash: 'password1',
							...(data.phone && { phone: data.phone }),
							accounts: {
								create: [
									{
										first_name: data.name.split(' ')[0],
										last_name: data.name.split(' ')[1],
										email,
										type: 'vendor',
										vendor_type: ['band', 'dj', 'musician'].at(Math.floor(Math.random() * 3)),
										phone: phone,
										genre,
										locations: {
											create: [{ city, state, zip }],
										},
										bio: `${data.company}, ${data.bonus}, ${data.eye}`,
										about_me,
									},
								],
							},
						},
						select: AuthSelectors.userWithAccount,
					})
					promises.push(newUserPromise)
				} catch (error) {
					console.log(error)
				}
			}

			const newUsers = await Promise.all([...promises])

			res.status(200).json({ data: newUsers })
		} catch (error) {
			res.status(500).send(error)
		}
	}
}
