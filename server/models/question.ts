import {
  DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin,
  HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Model, Optional, Sequelize,
} from 'sequelize';
import { IlmoApplication } from '../defs';
import { Answer } from './answer';

export const questionTypes = ['text', 'textarea', 'number', 'select', 'checkbox'] as const;
export type QuestionType = typeof questionTypes[number];

export interface QuestionAttributes {
  id: number;
  question: string;
  type: QuestionType;
  options: string | null;
  required: boolean;
  public: boolean;
  eventId: number;
}

export interface QuestionCreationAttributes
  extends Optional<QuestionAttributes, 'id' | 'options' | 'required' | 'public'> {}

export class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  public id!: number;
  public question!: string;
  public type!: QuestionType;
  public options!: string | null;
  public required!: boolean;
  public public!: boolean;

  public eventId!: number;
  public event?: Event;
  public getEvent!: HasOneGetAssociationMixin<Event>;
  public setEvent!: HasOneSetAssociationMixin<Event, number>;
  public createEvent!: HasOneCreateAssociationMixin<Event>;

  public answers?: Answer[];
  public getAnswers!: HasManyGetAssociationsMixin<Answer>;
  public countAnswers!: HasManyCountAssociationsMixin;
  public hasAnswer!: HasManyHasAssociationMixin<Answer, number>;
  public hasAnswers!: HasManyHasAssociationsMixin<Answer, number>;
  public setAnswers!: HasManySetAssociationsMixin<Answer, number>;
  public addAnswer!: HasManyAddAssociationMixin<Answer, number>;
  public addAnswers!: HasManyAddAssociationsMixin<Answer, number>;
  public removeAnswer!: HasManyRemoveAssociationMixin<Answer, number>;
  public removeAnswers!: HasManyRemoveAssociationsMixin<Answer, number>;
  public createAnswer!: HasManyCreateAssociationMixin<Answer>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (this: IlmoApplication) {
  const sequelize: Sequelize = this.get('sequelize');

  Question.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...questionTypes),
      allowNull: false,
    },
    options: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'question',
    freezeTableName: true,
    paranoid: true,
  });

  return Question;
}
