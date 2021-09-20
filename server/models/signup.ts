import moment from 'moment';
import {
  DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin,
  HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin,
  Model, Op, Optional,
} from 'sequelize';

import { IlmoApplication } from '../defs';
import { Answer } from './answer';
import { Quota } from './quota';

export interface SignupAttributes {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  confirmedAt: Date | null;
  createdAt: Date;
  quotaId: number;
}

export interface SignupCreationAttributes
  extends Optional<SignupAttributes, 'id' | 'firstName' | 'lastName' | 'email' | 'confirmedAt' | 'createdAt'> {}

export class Signup extends Model<SignupAttributes, SignupCreationAttributes> implements SignupAttributes {
  public id!: number;
  public firstName!: string | null;
  public lastName!: string | null;
  public email!: string | null;
  public confirmedAt!: Date | null;

  public quotaId!: number;
  public quota?: Quota;
  public getQuota!: HasOneGetAssociationMixin<Quota>;
  public setQuota!: HasOneSetAssociationMixin<Quota, number>;
  public createQuota!: HasOneCreateAssociationMixin<Quota>;

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

export default function setupSignupModel(this: IlmoApplication) {
  const sequelize = this.get('sequelize');

  Signup.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      quotaId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      confirmedAt: {
        type: DataTypes.DATE(3),
      },
      // Add createdAt manually to support milliseconds
      createdAt: {
        type: DataTypes.DATE(3),
        defaultValue: () => new Date(),
      },
    },
    {
      sequelize,
      modelName: 'signup',
      freezeTableName: true,
      paranoid: true,
      defaultScope: {
        where: {
          [Op.or]: {
            // Is confirmed
            confirmedAt: {
              [Op.ne]: null, // $means !=
            },
            // Under 30 minutes old
            createdAt: {
              [Op.gt]: moment()
                .subtract(30, 'minutes')
                .toDate(),
            },
          },
        },
      },
    },
  );

  return Signup;
}
