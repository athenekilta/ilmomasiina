import { DataTypes, Model, Optional } from 'sequelize';

import UserAttributes from '@tietokilta/ilmomasiina-api/src/models/user';
import { IlmoApplication } from '../defs';

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// User for local auth admin signup

export default function setupUserModel(this: IlmoApplication) {
  const sequelize = this.get('sequelize');

  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'user',
    freezeTableName: true,
  });

  return User;
}
