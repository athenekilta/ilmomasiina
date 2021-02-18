import {
  DataTypes, Model, Optional, Op, HasOneGetAssociationMixin, HasOneCreateAssociationMixin, HasOneSetAssociationMixin,
  HasManyRemoveAssociationsMixin, HasManyCreateAssociationMixin, HasManyRemoveAssociationMixin,
  HasManyGetAssociationsMixin, HasManyCountAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
  HasManySetAssociationsMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin,
} from 'sequelize';
import moment from 'moment';
import { IlmoApplication } from '../defs';
import { Quota } from './quota';
import { Answer } from './answer';

export interface SignupAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  confirmedAt: Date;
  editToken: any;
  createdAt: Date;
}

export interface SignupCreationAttributes extends Optional<SignupAttributes, 'id'> {}

export class Signup extends Model<SignupAttributes, SignupCreationAttributes> implements SignupAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public confirmedAt!: Date;

  public editToken!: string; // TODO: move to service item type

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

export default function (this: IlmoApplication) {
  const sequelize = this.get('sequelize');

  Signup.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
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
      editToken: {
        type: DataTypes.VIRTUAL,
      },
      confirmedAt: {
        type: DataTypes.DATE(3),
      },
      // Added manually createdAt field to support milliseconds
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
