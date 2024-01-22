import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'

import { AccountsModule } from './src/modules/accounts'
import { AuthModule } from './src/modules/auth'
import { ReviewsModule } from './src/modules/reviews'

dotenv.config()

const app: Express = express()
const port = process.env.PORT
app.use(bodyParser.json())

// Enable CORS for all routes
app.use(cors())

app.get('/', (req: Request, res: Response) => {
	res.send('hello')
})

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

app.use('/api/auth', new AuthModule().getRoutes())
app.use('/api/accounts', new AccountsModule().getRoutes())
app.use('/api/reviews', new ReviewsModule().getRoutes())
