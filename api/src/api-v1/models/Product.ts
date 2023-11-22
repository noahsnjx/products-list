import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Optional,
  Sequelize
} from "sequelize";
import { components } from "../schema";
import { Category } from "./Category";

type ProductAttributes = components["schemas"]["Product"];

export interface ProductInput extends Optional<ProductAttributes, "id"> {}
export interface ProductOutput extends Required<ProductAttributes> {}

class Product
  extends Model<InferAttributes<Product>, InferCreationAttributes<Product>>
  implements ProductAttributes
{
  declare id: CreationOptional<string>;
  declare categoryId: ForeignKey<Category["id"]>;
  declare category: NonAttribute<Category>;
  declare name: string;
  declare price: number;
  declare stocked: boolean;
  declare static association: { category: Association<Product, Category> };
}

export default (sequelize: Sequelize) =>
  Product.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING
      },
      price: {
        type: DataTypes.FLOAT
      },
      stocked: { type: DataTypes.BOOLEAN }
    },
    {
      sequelize,
      tableName: "product"
    }
  );

export { Product };
