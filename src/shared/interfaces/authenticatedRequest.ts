import { AuthUsers } from '@prisma/client'
import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
	authUser?: AuthUsers
}
