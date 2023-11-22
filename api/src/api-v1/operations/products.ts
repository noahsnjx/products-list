import { NextFunction, Response, Request } from "express";
import { ProductsService } from "../services/productsService";
import { operations } from "../schema";
import { Operations } from "./types";

async function GET(this: any, req: Request, res: Response, next: NextFunction) {
  const productsService = this.dependencies.productsService as ProductsService;
  const products = await productsService.getProducts(req.query.name?.toString());

  res.status(200).json(products);
}

GET.operationId = "getProducts" as const;

async function POST(
  this: any,
  req: Request<operations["postProduct"]["requestBody"]["content"]["application/json"]>,
  res: Response,
  next: NextFunction
) {
  const productsService = this.dependencies.productsService as ProductsService;
  const product = await productsService.createProduct(
    req.body.name,
    req.body.category,
    req.body.stocked,
    req.body.price
  );

  res.status(201).json(product);
}

POST.operationId = "postProduct" as const;

async function DELETE(this: any, req: Request, res: Response, next: NextFunction) {
  const productsService = this.dependencies.productsService as ProductsService;

  await productsService.deleteProduct(req.params.id);

  res.status(200).send();
}

DELETE.operationId = "deleteProduct";

const productOperations: Operations = { GET, POST, DELETE };

export default productOperations;
