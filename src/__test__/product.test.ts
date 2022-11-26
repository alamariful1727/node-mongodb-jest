import supertest from "supertest";
import {
	clearTestMongoDb,
	connectTestMongoDb,
	disconnectTestMongoDb,
} from "./../database";
import createServer from "./../server";
import { CreateProductInput } from "./../modules/product/product.validation";
import { createProduct } from "./../modules/product/product.service";

const app = createServer();

describe("product - mongodb-memory-server", () => {
	beforeAll(async () => await connectTestMongoDb());
	afterAll(async () => await disconnectTestMongoDb());
	afterEach(async () => await clearTestMongoDb());

	const createProductPayload: CreateProductInput["body"] = {
		name: "Test product",
		description: "Testing product's description",
	};

	const createProductsPayload: CreateProductInput["body"][] = [
		{
			name: "Test product 1",
			description: "Testing product 1's description",
		},
		{
			name: "Test product 2",
			description: "Testing product 2's description",
		},
	];

	/*
		? Create product scenarios
	*/
	describe("create product route", () => {
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
		? get product scenarios
  */
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

		describe("given the productId does exist", () => {
			it("should return a 200 and validate response body", async () => {
				const product = await createProduct(createProductPayload);

				const { statusCode, body } = await supertest(app).get(
					`/api/products/${product._id}`,
				);

				expect(statusCode).toBe(200);
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
		? get products scenarios
  */
	describe("get products route", () => {
		describe("get all products", () => {
			it("should return a 200 and validate response body", async () => {
				for await (const singleProductPayload of createProductsPayload) {
					await createProduct(singleProductPayload);
				}

				const { statusCode, body } = await supertest(app).get("/api/products");

				expect(statusCode).toBe(200);
				expect(body).toEqual(
					expect.objectContaining({
						products: expect.arrayContaining([
							expect.objectContaining({
								_id: expect.any(String),
								createdAt: expect.any(String),
								updatedAt: expect.any(String),
								name: expect.any(String),
								description: expect.any(String),
							}),
						]),
					}),
				);
			});
		});
	});

	/*
		? delete product scenarios
  */
	describe("delete product route", () => {
		describe("given the productId cast error failed", () => {
			it("should return a 500", async () => {
				const productId = "asd";
				const { statusCode } = await supertest(app).delete(
					`/api/products/${productId}`,
				);
				expect(statusCode).toBe(500);
			});
		});

		describe("given the productId does not exist", () => {
			it("should return a 404", async () => {
				const productId = "63786439be8ca060c32d1c48";
				const { statusCode } = await supertest(app).delete(
					`/api/products/${productId}`,
				);
				expect(statusCode).toBe(404);
			});
		});

		describe("given the productId does exist", () => {
			it("should return a 200 and validate response body", async () => {
				const product = await createProduct(createProductPayload);

				const { statusCode, body } = await supertest(app).delete(
					`/api/products/${product._id}`,
				);

				expect(statusCode).toBe(200);
				expect(body).toEqual({
					message: "Product removed successfully",
				});
			});
		});
	});

	/*
		? update product scenarios
  */
	describe("update product route", () => {
		describe("given the productId cast error failed", () => {
			it("should return a 500", async () => {
				const productId = "asd";
				const { statusCode } = await supertest(app).put(
					`/api/products/${productId}`,
				);
				expect(statusCode).toBe(500);
			});
		});

		describe("given the productId does not exist", () => {
			it("should return a 404", async () => {
				const productId = "63786439be8ca060c32d1c48";
				const { statusCode } = await supertest(app).put(
					`/api/products/${productId}`,
				);
				expect(statusCode).toBe(404);
			});
		});

		describe("given the productId does exist", () => {
			it("should return a 200 and validate response body", async () => {
				const product = await createProduct(createProductPayload);

				const { statusCode, body } = await supertest(app).put(
					`/api/products/${product._id}`,
				);

				expect(statusCode).toBe(200);
				expect(body).toEqual(
					expect.objectContaining({
						message: "Product updated successfully",
						product: expect.objectContaining({
							_id: expect.any(String),
							createdAt: expect.any(String),
							updatedAt: expect.any(String),
							name: expect.any(String),
							description: expect.any(String),
						}),
					}),
				);
			});
		});
	});
});
