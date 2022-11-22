import supertest from "supertest";
import { connectTestMongoDb, disconnectTestMongoDb } from "./../database";
import createServer from "../server";
import { CreateProductInput } from "@src/modules/product/product.validation";

const app = createServer();

describe("product", () => {
	beforeAll(async () => await connectTestMongoDb());
	afterAll(async () => await disconnectTestMongoDb());

	/*
		? Create product scenarios
s	*/
	describe("create product route", () => {
		const createProductPayload: CreateProductInput["body"] = {
			name: "Test product",
			description: "Testing product's description",
		};

		describe("given empty body", () => {
			it("should return a 400 and validate error response", async () => {
				const { body, statusCode } = await supertest(app)
					.post("/api/products")
					.send({});

				expect(statusCode).toBe(400);

				expect(body).toEqual({
					errors: [
						{
							code: "invalid_type",
							expected: "string",
							received: "undefined",
							path: ["body", "name"],
							message: "Name is required",
						},
						{
							code: "invalid_type",
							expected: "string",
							received: "undefined",
							path: ["body", "description"],
							message: "Description is required",
						},
					],
				});
			});
		});

		describe("given incomplete body - only name", () => {
			it("should return a 400 and validate error response", async () => {
				const { body, statusCode } = await supertest(app)
					.post("/api/products")
					.send({ name: createProductPayload.name });

				expect(statusCode).toBe(400);

				expect(body).toEqual({
					errors: [
						{
							code: "invalid_type",
							expected: "string",
							received: "undefined",
							path: ["body", "description"],
							message: "Description is required",
						},
					],
				});
			});
		});

		describe("given incomplete body - only description", () => {
			it("should return a 400 and validate error response", async () => {
				const { body, statusCode } = await supertest(app)
					.post("/api/products")
					.send({ description: createProductPayload.description });

				expect(statusCode).toBe(400);

				expect(body).toEqual({
					errors: [
						{
							code: "invalid_type",
							expected: "string",
							received: "undefined",
							path: ["body", "name"],
							message: "Name is required",
						},
					],
				});
			});
		});

		describe("given complete body", () => {
			it("should return a 200 and create a product", async () => {
				const { body, statusCode } = await supertest(app)
					.post("/api/products")
					.send(createProductPayload);

				expect(statusCode).toBe(201);

				expect(body).toEqual({
					product: {
						_id: expect.any(String),
						createdAt: expect.any(String),
						updatedAt: expect.any(String),
						...createProductPayload,
					},
				});
			});
		});
	});

	/*
		get product scenarios
s	*/
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
