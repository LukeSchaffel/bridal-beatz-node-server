export class AccountsSelectors {
	static singleAccount = {
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
		about_me: true,
		bio: true,
		images: true,
	}

	static multipleAccounts = {
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
		about_me: true,
		bio: true,
		images: { where: { avatar: true } },
	}
}
