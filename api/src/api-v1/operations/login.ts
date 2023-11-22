import { NextFunction, Response, Request } from "express";
import { operations } from "../schema";
import { Operations } from "./types";
import { UsersService } from "../services/usersService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function POST(
  this: any,
  req: Request<operations["login"]["requestBody"]["content"]["application/json"]>,
  res: Response,
  next: NextFunction
) {
  const usersService = this.dependencies.usersService as UsersService;
  const user = await usersService.getUserByUsername(req.body.username);

  if (!user || !bcrypt.compareSync(req.body.password, user.get("password"))) {
    throw new Error("Bad credentials");
  }

  res.status(201).json({
    accessToken: jwt.sign({ userId: user.id }, "secret", { expiresIn: "1800s" })
  });
}

POST.operationId = "login";

const loginOperations: Operations = { POST };

export default loginOperations;
