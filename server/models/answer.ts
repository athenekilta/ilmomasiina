import {
  DataTypes, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Model, Optional,
} from 'sequelize';
import { IlmoApplication } from '../defs';
import { Question } from './question';
import { Signup } from './signup';

export interface AnswerAttributes {
  id: number;
  answer: string;
  questionId: number;
  signupId: number;
}

export interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {}

export class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  public id!: number;
  public answer!: string;

  public questionId!: number;
  public question?: Question;
  public getQuestion!: HasOneGetAssociationMixin<Question>;
  public setQuestion!: HasOneSetAssociationMixin<Question, number>;
  public createQuestion!: HasOneCreateAssociationMixin<Question>;

  public signupId!: number;
  public signup?: Signup;
  public getSignup!: HasOneGetAssociationMixin<Signup>;
  public setSignup!: HasOneSetAssociationMixin<Signup, number>;
  public createSignup!: HasOneCreateAssociationMixin<Signup>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (this: IlmoApplication) {
  const sequelize = this.get('sequelize');

  Answer.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    questionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    signupId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'answer',
    freezeTableName: true,
    paranoid: true,
  });

  return Answer;
}
