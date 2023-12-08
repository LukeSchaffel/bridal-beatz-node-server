import { IsString, IsNumber, IsEnum, IsOptional, MinLength } from 'class-validator'

import { ACCOUNT_TYPE_ENUM } from '@prisma/client'

export class SignupDTO {
	constructor(options: SignupDTO) {
		this.email = options.email
		this.first_name = options.first_name
		this.last_name = options.last_name
		this.phone = options.phone
		this.password = options.password
		this.password2 = options.password2
		this.type = options.type
	}

	@IsString()
	email: string

	@IsString()
	first_name: string

	@IsString()
	last_name: string

	@IsString()
	@IsOptional()
	phone?: string

	@IsString()
	@MinLength(8)
	password: string

	@IsString()
	@MinLength(8)
	password2: string

	@IsEnum(ACCOUNT_TYPE_ENUM)
	type: ACCOUNT_TYPE_ENUM
}
