import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyCreateAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Optional,
  Sequelize
} from "sequelize";
import { components } from "../schema";
import { Product } from "./Product";

type CategoryAttributes = components["schemas"]["Category"];

export interface CategoryInput extends Optional<CategoryAttributes, "id"> {}
export interface CategoryOutput extends Required<CategoryAttributes> {}

class Category
  extends Model<
    InferAttributes<Category, { omit: "products" }>,
    InferCreationAttributes<Category, { omit: "products" }>
  >
  implements CategoryAttributes
{
  declare id: CreationOptional<string>;
  declare name: string;
  declare products: NonAttribute<Product[]>;
  declare createProduct: HasManyCreateAssociationMixin<Product, "categoryId">;
  declare static association: { product: Association<Category, Product> };
}

export default (sequelize: Sequelize) =>
  Category.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: { type: DataTypes.STRING }
    },
    {
      sequelize,
      tableName: "category"
    }
  );
export { Category };
