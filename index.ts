import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { AuthModule } from "./modules/auth";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use('/api/auth', new AuthModule().getRoutes())
