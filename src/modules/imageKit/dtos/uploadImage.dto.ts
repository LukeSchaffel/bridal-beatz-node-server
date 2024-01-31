import { IsString, IsNumber, IsEnum, IsOptional, MinLength } from 'class-validator'

export class UploadImageDTO {
	constructor(options: UploadImageDTO) {
		this.type = options.type
	}

	@IsString()
	@IsOptional()
	type?: 'avatar' | 'bulk'
}
