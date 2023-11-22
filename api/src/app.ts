import express from "express";
import { initialize } from "express-openapi";
import bodyParser from "body-parser";
import initSequelize from "./sequelize";
import initServices from "./api-v1/services";
import initModels from "./api-v1/models";
import initOperations from "./api-v1/operations";
import errorMiddleware from "./middlewares/error";
import cors from "cors";
import jwt from "jsonwebtoken";

const apiDocV1 = "./resources/api-v1-doc.yml";

async function main() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const sequelize = await initSequelize();
  const services = initServices(sequelize);
  const operations = initOperations();

  await initModels(sequelize);

  initialize({
    app,
    apiDoc: apiDocV1,
    dependencies: { ...services },
    operations,
    securityHandlers: {
      bearerAuth: (req) =>
        new Promise((resolve, reject) => {
          if (
            !req.headers ||
            !("authorization" in req.headers) ||
            typeof req.headers.authorization !== "string"
          ) {
            return void resolve(false);
          }

          const token = req.headers.authorization.split(/\s+/)[1];

          jwt.verify(token, "secret", {}, (error, payload) => {
            if (error) {
              return void resolve(false);
            }

            //@ts-expect-error TODO: add type
            req.userSession = payload;
            resolve(true);
          });
        })
    },
    errorMiddleware
  });

  const PORT = 8000;

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

main();
