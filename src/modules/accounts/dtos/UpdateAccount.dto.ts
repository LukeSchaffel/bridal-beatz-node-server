import { CLIENT_TYPE_ENUM, VENDOR_TYPE_ENUM, GENRE_ENUM } from '@prisma/client'
import { IsString, IsEnum, IsOptional, ValidateNested } from 'class-validator'

class Location {
	@IsString()
	@IsOptional()
	city?: string

	@IsString()
	@IsOptional()
	state?: string

	@IsString()
	@IsOptional()
	zip?: string
}

export class UpdateAccountDTO {
	constructor(options: UpdateAccountDTO) {
		this.first_name = options.first_name
		this.last_name = options.last_name
		this.phone = options.phone
		this.vendor_type = options.vendor_type
		this.client_type = options.client_type
		this.genre = options.genre
		this.locations = options.locations
		this.links = options.links
	}

	@IsString()
	@IsOptional()
	first_name?: string

	@IsString()
	@IsOptional()
	last_name?: string

	@IsString()
	@IsOptional()
	phone?: string

	@IsEnum(VENDOR_TYPE_ENUM)
	@IsOptional()
	vendor_type?: string

	@IsEnum(CLIENT_TYPE_ENUM)
	@IsOptional()
	client_type?: string

	@ValidateNested({ each: true })
	@IsOptional()
	locations?: Location[]

	@ValidateNested({ each: true })
	@IsOptional()
	genre?: GENRE_ENUM[]

	@ValidateNested({ each: true })
	@IsOptional()
	links?: string[]
}
