import ImageKit from 'imagekit'
import { ImageKitOptions } from 'imagekit/dist/libs/interfaces'
import { AuthenticatedRequest } from '../../shared/interfaces/authenticatedRequest'
import { Response } from 'express'

export const imagekit = new ImageKit({
	publicKey: process.env.IMAGEKIT_PUBLIC_API_KEY as string,
	privateKey: process.env.IMAGEKIT_PRIVATE_API_KEY as string,
	urlEndpoint: `https://ik.imagekit.io/${process.env.IMAGEKIT_URL_ID}/`,
})

export class ImageKitController {
	async uploadImage(req: AuthenticatedRequest, res: Response) {
		try {
			const account_id = parseInt(req.params.account_id, 10)
			const { file } = req.body
			const img = await imagekit.upload({
				file,
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
			res.status(200).json({ data: img.url })
		} catch (error) {
			res.status(500).send(error)
		}
	}
}
