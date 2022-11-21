import supertest from "supertest";
import createServer from "../server";

const app = createServer();

describe("product", () => {
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
	});
});
