import { CLIENT_TYPE_ENUM, VENDOR_TYPE_ENUM, GENRE_ENUM } from '@prisma/client'
import { IsString, IsEnum, IsOptional, ValidateNested, IsNumber } from 'class-validator'

export class CreateOrUpdateLocationDTO {
	constructor(options: CreateOrUpdateLocationDTO) {
		this.city = options.city
		this.state = options.state
		this.zip = options.zip
		this.location_id = options.location_id
	}
	@IsString()
	@IsOptional()
	city?: string

	@IsString()
	@IsOptional()
	state?: string

	@IsString()
	@IsOptional()
	zip?: string

	@IsNumber()
	@IsOptional()
	location_id?: number
}

export class CreateOrUpdateLinkDTO {
	constructor(options: CreateOrUpdateLinkDTO) {
		this.url = options.url
		this.title = options.url
		this.link_id = options.link_id
	}

	@IsString()
	@IsOptional()
	url?: string

	@IsString()
	@IsOptional()
	title?: string

	@IsNumber()
	@IsOptional()
	link_id?: number
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
		this.bio = options.bio
		this.about_me = options.about_me
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

	@IsString()
	@IsOptional()
	bio?: string

	@IsString()
	@IsOptional()
	about_me?: string

	@IsEnum(VENDOR_TYPE_ENUM)
	@IsOptional()
	vendor_type?: VENDOR_TYPE_ENUM

	@IsEnum(CLIENT_TYPE_ENUM)
	@IsOptional()
	client_type?: CLIENT_TYPE_ENUM

	@ValidateNested({ each: true })
	@IsOptional()
	locations?: CreateOrUpdateLocationDTO[]

	@IsEnum(GENRE_ENUM, { each: true })
	@IsOptional()
	genre?: GENRE_ENUM[]

	@ValidateNested({ each: true })
	@IsOptional()
	links?: CreateOrUpdateLinkDTO[]
}
