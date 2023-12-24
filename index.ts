import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { AuthModule } from "./src/modules/auth";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use('/api/auth', new AuthModule().getRoutes())