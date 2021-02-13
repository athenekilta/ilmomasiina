import { Sequelize, DataTypes, Model, Optional, Op } from 'sequelize';
import { Application } from '@feathersjs/express';
import md5 from 'md5';
import moment from 'moment';
import config from '../config/ilmomasiina.config'; // eslint-disable-line

export interface SignupAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  confirmedAt: Date;
  editToken: any;
  createdAt: Date;
}

export interface SignupCreationAttributes extends Optional<SignupAttributes, "id"> {}

export class Signup extends Model<SignupAttributes, SignupCreationAttributes> implements SignupAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public confirmedAt!: Date;
  public editToken!: any;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (this: Application) {
  const sequelize: Sequelize = this.get('sequelize');

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
      modelName: "signup",
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

  // TODO: edit token validation
  // const verifyEditToken = (data) => {
  //   const token = data.attributes ? data.attributes.editToken : data.where.editToken;

  //   if (data.where.editToken) {
  //     delete data.where.editToken;
  //   }

  //   if (token !== md5(`${data.where[Symbol('and')].id}${config.editTokenSalt}`)) {
  //     throw new Error('Invalid editToken');
  //   }
  // };

  // Signup.beforeBulkUpdate({ individualHooks: true }, verifyEditToken);
  // Signup.beforeBulkDestroy({ individualHooks: true }, verifyEditToken);

  return Signup;
};
