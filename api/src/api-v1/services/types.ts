import { Sequelize } from "sequelize";

interface Service {}

type ServiceFactory<S extends Service> = (sequelize: Sequelize) => S;

export { Service, ServiceFactory };
