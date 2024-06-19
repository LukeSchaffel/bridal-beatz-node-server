import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	try {
		await prisma.$connect()
		console.log('Connected to the database')

		// Perform any Prisma operations here
	} catch (error) {
		console.error('Failed to connect to the database:', error)
		throw error
	} finally {
		await prisma.$disconnect()
		console.log('Disconnected from the database')
	}
}

main()
	.catch((error) => {
		console.error('Error during Prisma operation:', error)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

export { prisma }
