import { Sequelize } from "sequelize";
import productsServiceFactory from "./productsService";
import usersServiceFactory from "./usersService";

function initServices(sequelize: Sequelize) {
  return {
    productsService: productsServiceFactory(sequelize),
    usersService: usersServiceFactory(sequelize)
  };
}

export default initServices;
