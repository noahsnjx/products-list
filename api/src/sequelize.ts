import { Sequelize } from "sequelize";

async function initSequelize() {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"
  });

  try {
    await sequelize.authenticate();
    console.log("Connection with sequelize has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  return sequelize;
}

export default initSequelize;
