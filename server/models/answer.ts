import { Application } from '@feathersjs/express';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface AnswerAttributes {
  id: number;
  answer: string;
}

export interface AnswerCreationAttributes extends Optional<AnswerAttributes, "id"> {}

export class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  public id!: number;
  public answer!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (this: Application) {
  const sequelize: Sequelize = this.get('sequelize');

  Answer.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: "answer",
    freezeTableName: true,
    paranoid: true,
  });

  return Answer;
}
