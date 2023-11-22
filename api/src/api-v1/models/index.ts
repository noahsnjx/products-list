import { Sequelize } from "sequelize";
import Product from "./Product";
import Category from "./Category";
import User from "./User";

async function initModels(sequelize: Sequelize) {
  const product = Product(sequelize);
  const category = Category(sequelize);
  const user = User(sequelize);

  category.hasMany(product, {
    sourceKey: "id",
    foreignKey: { name: "categoryId", allowNull: false },
    as: "products"
  });

  await sequelize.drop();
  await sequelize.sync();

  const newCategory = await category.create({ name: "Fruits" });
  const newProduct = await newCategory.createProduct({ name: "Apple", price: 2.5, stocked: true });
  const newUser = await user.create({ username: "Nono", password: "test" });
}

export default initModels;
