import ImageKit from 'imagekit'
import { AuthenticatedRequest } from '../../shared/interfaces/authenticatedRequest'
import { Response } from 'express'
import { prisma } from '../../../prismaClient'

export const imagekit = new ImageKit({
	publicKey: process.env.IMAGEKIT_PUBLIC_API_KEY as string,
	privateKey: process.env.IMAGEKIT_PRIVATE_API_KEY as string,
	urlEndpoint: `https://ik.imagekit.io/${process.env.IMAGEKIT_URL_ID}/`,
})

export class ImageKitController {
	async uploadImage(req: AuthenticatedRequest, res: Response) {
		try {
			const account_id = parseInt(req.params.account_id, 10)
			const { type } = req.query

			const existingImages = await prisma.images.findMany({ where: { account_id } })
			const existingAvatar = await prisma.images.findFirst({ where: { account_id, avatar: true } })
			if (existingAvatar) {
				const updatedAvatar = await prisma.images.update({
					where: {
						image_id: existingAvatar.image_id,
					},
					data: {
						avatar: false,
					},
				})
			}

			if (req.file) {
				const img = await imagekit.upload({
					file: req.file.buffer,
					fileName: 'firsttry.jpg',
					folder: `${process.env.DEV_OR_PROD}/images/accounts/${account_id}`,
					extensions: [
						{
							name: 'google-auto-tagging',
							maxTags: 5,
							minConfidence: 1,
						},
					],
				})
				const dbImg = await prisma.images.create({
					data: {
						account_id,
						url: img.url,
						image_kit_id: img.fileId,
						meta: JSON.stringify(img),
						avatar: type === 'avatar',
					},
				})
				res.status(200).json({ data: img.url })
			}
		} catch (error) {
			res.status(500).send(error)
		}
	}
}
