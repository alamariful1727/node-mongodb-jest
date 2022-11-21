import mongoose from "mongoose";
import config from "config";
import { MongoMemoryServer } from "mongodb-memory-server";
import log from "./../utils/logger";

async function connectToDatabase() {
	const dbUri = config.get<string>("dbUri");

	try {
		await mongoose.connect(dbUri);
		log.info("Connected to MongDB");
	} catch (e) {
		log.error("Unable to connect database");
		process.exit(1);
	}
}

export async function connectTestMongoDb() {
	const mongoServer = await MongoMemoryServer.create();
	const dbUri = mongoServer.getUri();

	try {
		await mongoose.connect(dbUri);
	} catch (e) {
		log.error("Unable to connect TEST database");
		process.exit(1);
	}
}

export async function disconnectTestMongoDb() {
	try {
		await mongoose.disconnect();
		await mongoose.connection.close();
	} catch (e) {
		log.error("Unable to disconnect TEST database");
		process.exit(1);
	}
}

export default connectToDatabase;
