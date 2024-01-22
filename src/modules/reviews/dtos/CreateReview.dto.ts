import { IsString, IsNumber } from 'class-validator'

export class CreateReviewDTO {
	constructor(options: CreateReviewDTO) {
		this.content = options.content
		this.rating = options.rating
	}

	@IsString()
	content: string

	@IsNumber()
	rating: number
}
