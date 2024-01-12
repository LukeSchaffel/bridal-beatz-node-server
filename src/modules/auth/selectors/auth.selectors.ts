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
				account_id: true,
				phone: true,
				first_name: true,
				last_name: true,
				email: true,
				type: true,
				vendor_type: true,
				client_type: true,
				genre: true,
				locations: true,
				links: true,
				bio: true,
				about_me: true,
			},
		},
	}
}
