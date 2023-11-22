import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Optional,
  Sequelize
} from "sequelize";
import { components } from "../schema";
import bcrypt from "bcrypt";

type UserAttributes = components["schemas"]["User"];

export interface UserInput extends Optional<UserAttributes, "id"> {}
export interface UserOutput extends Required<UserAttributes> {}

class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserAttributes
{
  declare id: CreationOptional<string>;
  declare username: string;
  declare password: string;
}

export default (sequelize: Sequelize) =>
  User.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      username: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING }
    },
    {
      sequelize,
      tableName: "User",
      hooks: {
        beforeSave: (instance) => {
          if (instance.changed("password")) {
            const plainPassword = instance.get("password");
            const salt = bcrypt.genSaltSync(12);
            const hash = bcrypt.hashSync(plainPassword, salt);

            instance.set("password", hash);
          }
        }
      },
      indexes: [{ fields: ["username"], unique: true }]
    }
  );
export { User };
