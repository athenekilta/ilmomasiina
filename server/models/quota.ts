import { Application } from '@feathersjs/express';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface QuotaAttributes {
  id: number;
  title: string;
  size: number | null;
}

export interface QuotaCreationAttributes extends Optional<QuotaAttributes, "id"> {}

export class Quota extends Model<QuotaAttributes, QuotaCreationAttributes> implements QuotaAttributes {
  public id!: number;
  public title!: string;
  public size!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (this: Application) {
  const sequelize: Sequelize = this.get('sequelize');

  Quota.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: "quota",
    freezeTableName: true,
    paranoid: true,
  });

  return Quota;
};
