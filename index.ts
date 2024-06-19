import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import ImageKit from 'imagekit'

import { AccountsModule } from './src/modules/accounts'
import { AuthModule } from './src/modules/auth'
import { ReviewsModule } from './src/modules/reviews'
import { ImageKitModule } from './src/modules/imageKit'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000
app.use(bodyParser.json())

// Enable CORS for all routes
app.use(cors())

app.get('/', (req: Request, res: Response) => {
	res.send('hello')
})
console.log('the database URL is ', process.env.DATABASE_URL)
app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

app.use('/api/auth', new AuthModule().getRoutes())
app.use('/api/accounts', new AccountsModule().getRoutes())
app.use('/api/reviews', new ReviewsModule().getRoutes())
app.use('/api/images', new ImageKitModule().getRoutes())
