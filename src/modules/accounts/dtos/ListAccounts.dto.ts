import { CLIENT_TYPE_ENUM, VENDOR_TYPE_ENUM, GENRE_ENUM, ACCOUNT_TYPE_ENUM } from '@prisma/client'
import { IsString, IsEnum, IsOptional, ValidateNested, IsNumber } from 'class-validator'

export enum SORT_BY_ENUM {
	'total',
	'average_rating',
	'score'
}

export class ListAccountsDTO {
	constructor(options: ListAccountsDTO) {
		this.type = options.type
		this.vendor_type = options.vendor_type
		this.client_type = options.client_type
		this.state = options.state
		this.search = options.search
		this.take = options.take
		this.sort_by = options.sort_by
	}

	@IsEnum(ACCOUNT_TYPE_ENUM)
	@IsOptional()
	type?: ACCOUNT_TYPE_ENUM

	@IsEnum(VENDOR_TYPE_ENUM)
	@IsOptional()
	vendor_type?: VENDOR_TYPE_ENUM

	@IsEnum(CLIENT_TYPE_ENUM)
	@IsOptional()
	client_type?: CLIENT_TYPE_ENUM

	@IsString()
	@IsOptional()
	state?: string

	@IsString()
	@IsOptional()
	search?: string

	@IsString()
	@IsOptional()
	take?: string

	@IsEnum(SORT_BY_ENUM)
	@IsOptional()
	sort_by?: string
}
