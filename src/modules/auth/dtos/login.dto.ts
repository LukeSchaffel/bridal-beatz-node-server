import { IsString } from 'class-validator'

export class LoginDTO {
	constructor(options: LoginDTO) {
		this.email = options.email
		this.password = options.password
	}

	@IsString()
	email: string

	@IsString()
	password: string
}
