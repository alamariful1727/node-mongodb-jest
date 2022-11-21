import mongoose from "mongoose";
import config from "config";
import log from "@src/utils/logger";

async function connectToDatabase() {
	const dbUri = config.get<string>("dbUri");

	try {
		await mongoose.connect(dbUri);
		log.info("Connected to MongDB");
	} catch (e) {
		log.info("Unable to connect database");
		process.exit(1);
	}
}

export default connectToDatabase;
