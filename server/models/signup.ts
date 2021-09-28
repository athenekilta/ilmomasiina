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
import { generateRandomId, RANDOM_ID_LENGTH } from './randomId';

export const signupStatuses = ['in-quota', 'in-open', 'in-queue'] as const;
export type SignupStatus = typeof signupStatuses[number];

export interface SignupAttributes {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  confirmedAt: Date | null;
  status: SignupStatus | null;
  position: number | null;
  createdAt: Date;
  quotaId: Quota['id'];
}

export interface SignupCreationAttributes
  extends Optional<SignupAttributes, 'id' | 'firstName' | 'lastName' | 'email' | 'confirmedAt'
  | 'status' | 'position' | 'createdAt'> {}

export class Signup extends Model<SignupAttributes, SignupCreationAttributes> implements SignupAttributes {
  public id!: string;
  public firstName!: string | null;
  public lastName!: string | null;
  public email!: string | null;
  public confirmedAt!: Date | null;
  public status!: SignupStatus | null;
  public position!: number | null;

  public quotaId!: Quota['id'];
  public quota?: Quota;
  public getQuota!: HasOneGetAssociationMixin<Quota>;
  public setQuota!: HasOneSetAssociationMixin<Quota, Quota['id']>;
  public createQuota!: HasOneCreateAssociationMixin<Quota>;

  public answers?: Answer[];
  public getAnswers!: HasManyGetAssociationsMixin<Answer>;
  public countAnswers!: HasManyCountAssociationsMixin;
  public hasAnswer!: HasManyHasAssociationMixin<Answer, Answer['id']>;
  public hasAnswers!: HasManyHasAssociationsMixin<Answer, Answer['id']>;
  public setAnswers!: HasManySetAssociationsMixin<Answer, Answer['id']>;
  public addAnswer!: HasManyAddAssociationMixin<Answer, Answer['id']>;
  public addAnswers!: HasManyAddAssociationsMixin<Answer, Answer['id']>;
  public removeAnswer!: HasManyRemoveAssociationMixin<Answer, Answer['id']>;
  public removeAnswers!: HasManyRemoveAssociationsMixin<Answer, Answer['id']>;
  public createAnswer!: HasManyCreateAssociationMixin<Answer>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function setupSignupModel(this: IlmoApplication) {
  const sequelize = this.get('sequelize');

  Signup.init(
    {
      id: {
        type: DataTypes.CHAR(RANDOM_ID_LENGTH),
        primaryKey: true,
        defaultValue: generateRandomId,
      },
      quotaId: {
        type: DataTypes.CHAR(RANDOM_ID_LENGTH),
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
      status: {
        type: DataTypes.ENUM(...signupStatuses),
      },
      position: {
        type: DataTypes.INTEGER,
      },
      // Add createdAt manually to support milliseconds
      createdAt: {
        type: DataTypes.DATE(3),
        defaultValue: () => new Date(),
        allowNull: false,
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
