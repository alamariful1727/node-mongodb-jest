import supertest from "supertest";
import { connectTestMongoDb, disconnectTestMongoDb } from "./../database";
import createServer from "../server";

const app = createServer();

describe("product", () => {
	beforeAll(async () => await connectTestMongoDb());
	afterAll(async () => await disconnectTestMongoDb());

	describe("get product route", () => {
		describe("given the productId cast error failed", () => {
			it("should return a 500", async () => {
				const productId = "asd";
				const { statusCode } = await supertest(app).get(
					`/api/products/${productId}`,
				);
				expect(statusCode).toBe(500);
			});
		});
		describe("given the productId does not exist", () => {
			it("should return a 404", async () => {
				const productId = "63786439be8ca060c32d1c48";
				const { statusCode } = await supertest(app).get(
					`/api/products/${productId}`,
				);
				expect(statusCode).toBe(404);
			});
		});
	});
});
