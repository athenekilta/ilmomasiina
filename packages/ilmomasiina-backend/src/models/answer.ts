import {
  DataTypes, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Model, Optional,
  Sequelize,
} from 'sequelize';

import AnswerAttributes from '@tietokilta/ilmomasiina-models/dist/models/answer';
import { Question } from './question';
import { RANDOM_ID_LENGTH } from './randomId';
import { Signup } from './signup';

export interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {}

export class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  public id!: string;
  public answer!: string;

  public questionId!: Question['id'];
  public question?: Question;
  public getQuestion!: HasOneGetAssociationMixin<Question>;
  public setQuestion!: HasOneSetAssociationMixin<Question, Question['id']>;
  public createQuestion!: HasOneCreateAssociationMixin<Question>;

  public signupId!: Signup['id'];
  public signup?: Signup;
  public getSignup!: HasOneGetAssociationMixin<Signup>;
  public setSignup!: HasOneSetAssociationMixin<Signup, Signup['id']>;
  public createSignup!: HasOneCreateAssociationMixin<Signup>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function setupAnswerModel(sequelize: Sequelize) {
  Answer.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    questionId: {
      type: DataTypes.CHAR(RANDOM_ID_LENGTH),
      allowNull: false,
    },
    signupId: {
      type: DataTypes.CHAR(RANDOM_ID_LENGTH),
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
