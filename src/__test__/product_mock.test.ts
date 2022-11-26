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
		it("should return the product payload", async () => {
			const createProductServiceMock = jest
				.spyOn(ProductService, "createProduct")
				// @ts-ignore
				.mockReturnValueOnce(createProductResponse);

			const { statusCode, body } = await supertest(app)
				.post("/api/products")
				.send(createProductInput);

			expect(statusCode).toBe(201);
			expect(body.product).toEqual(createProductResponse);

			expect(createProductServiceMock).toHaveBeenCalledWith(createProductInput);
		});
	});
});
