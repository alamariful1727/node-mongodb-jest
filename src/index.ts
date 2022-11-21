import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction, json } from "express";
import config from "config";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "@src/route";
import connectToDatabase from "@src/database";
import log from "@src/utils/logger";

const app = express();

app.use(json());
app.use(cors());
app.use(helmet());
app.use(morgan(config.get<string>("env") == "production" ? "prod" : "dev"));

app.get("/", (_req, res) => {
	return res.send("Hello, visitor");
});

app.use("/api", routes);

app.use((_req, res) => {
	return res.status(404).json({
		message: "API not found",
	});
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
	log.error(err);
	const type = err?.type;
	const message = err.message || "INTERNAL SERVER ERROR";
	const stack = err?.stack;
	const statusCode = err.status || err.statusCode || 500;

	return res.status(statusCode).json({
		type,
		message,
		stack,
	});
});

const PORT = config.get<number>("port");
app.listen(PORT, () => {
	log.info(`Server is listening at http://localhost:${PORT}`);
	connectToDatabase();
});
