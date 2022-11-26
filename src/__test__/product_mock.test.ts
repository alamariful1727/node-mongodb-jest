import supertest from "supertest";
import mongoose from "mongoose";
import * as ProductService from "../modules/product/product.service";
import createServer from "./../server";
import { CreateProductInput } from "@src/modules/product/product.validation";

const app = createServer();

const createProductInput: CreateProductInput["body"] = {
	name: "Test product",
	description: "Testing product's description",
};

const createProductResponse = {
	...createProductInput,
	_id: new mongoose.Types.ObjectId().toString(),
	createdAt: new Date().toString(),
	updatedAt: new Date().toString(),
};

describe("Service: Product", () => {
	/*
			? Create product scenarios
		*/
	describe("createProduct", () => {
		describe("given empty body", () => {
			it("should return a 400", async () => {
				const createProductServiceMock = jest
					.spyOn(ProductService, "createProduct")
					// @ts-ignore
					.mockReturnValueOnce(createProductResponse);

				const { statusCode } = await supertest(app)
					.post("/api/products")
					.send({});

				expect(statusCode).toBe(400);
				expect(createProductServiceMock).not.toHaveBeenCalled();
			});
		});
		describe("given incomplete body - only name", () => {
			it("should return a 400", async () => {
				const createProductServiceMock = jest
					.spyOn(ProductService, "createProduct")
					// @ts-ignore
					.mockReturnValueOnce(createProductResponse);

				const { statusCode } = await supertest(app)
					.post("/api/products")
					.send({ name: createProductInput.name });

				expect(statusCode).toBe(400);
				expect(createProductServiceMock).not.toHaveBeenCalled();
			});
		});
		describe("given incomplete body - only description", () => {
			it("should return a 400", async () => {
				const createProductServiceMock = jest
					.spyOn(ProductService, "createProduct")
					// @ts-ignore
					.mockReturnValueOnce(createProductResponse);

				const { statusCode } = await supertest(app)
					.post("/api/products")
					.send({ description: createProductInput.description });

				expect(statusCode).toBe(400);
				expect(createProductServiceMock).not.toHaveBeenCalled();
			});
		});
		describe("given complete body", () => {
			it("should return a 200 and the product payload", async () => {
				const createProductServiceMock = jest
					.spyOn(ProductService, "createProduct")
					// @ts-ignore
					.mockReturnValueOnce(createProductResponse);

				const { statusCode, body } = await supertest(app)
					.post("/api/products")
					.send(createProductInput);

				expect(statusCode).toBe(201);
				expect(body.product).toEqual(createProductResponse);

				expect(createProductServiceMock).toHaveBeenCalledWith(
					createProductInput,
				);
			});
		});
	});
});
