import { Application } from '@feathersjs/express';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface QuestionAttributes {
  id: number;
  question: string;
  type: string;
  options: string | null;
  required: boolean;
  public: boolean;
}

export interface QuestionCreationAttributes extends Optional<QuestionAttributes, "id" | "required" | "public"> {}

export class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  public id!: number;
  public question!: string;
  public type!: string;
  public options!: string | null;
  public required!: boolean;
  public public!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (this: Application) {
  const sequelize: Sequelize = this.get('sequelize');

  Question.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.STRING,
    },
    required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: "question",
    freezeTableName: true,
    paranoid: true,
  });

  return Question;
};
