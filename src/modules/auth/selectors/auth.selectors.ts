export class AuthSelectors {
	static userWithAccount = {
		user_id: true,
		first_name: true,
		last_name: true,
		email: true,
		is_admin: true,
		phone: true,
		accounts: {
			select: {
				phone: true,
				first_name: true,
				last_name: true,
				email: true,
				type: true,
			},
		},
	}
}
