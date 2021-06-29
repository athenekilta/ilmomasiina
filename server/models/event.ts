import moment from 'moment-timezone';
import {
  DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Op, Optional,
} from 'sequelize';

import { IlmoApplication } from '../defs';
import { Question } from './question';
import { Quota } from './quota';

export interface EventAttributes {
  id: number;
  title: string;
  date: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  openQuotaSize: number;
  description: string | null;
  price: string | null;
  location: string | null;
  facebookUrl: string | null;
  webpageUrl: string | null;
  draft: boolean;
  signupsPublic: boolean;
  verificationEmail: string | null;
}

export interface EventCreationAttributes
  extends Optional<EventAttributes, 'id' | 'openQuotaSize' | 'description' | 'price' | 'location'
  | 'facebookUrl' | 'webpageUrl' | 'draft' | 'signupsPublic' | 'verificationEmail'> {}

export class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: number;
  public title!: string;
  public date!: Date;
  public registrationStartDate!: Date;
  public registrationEndDate!: Date;
  public openQuotaSize!: number;
  public description!: string | null;
  public price!: string | null;
  public location!: string | null;
  public facebookUrl!: string | null;
  public webpageUrl!: string | null;
  public draft!: boolean;
  public signupsPublic!: boolean;
  public verificationEmail!: string | null;

  public questions?: Question[];
  public getQuestions!: HasManyGetAssociationsMixin<Question>;
  public countQuestions!: HasManyCountAssociationsMixin;
  public hasQuestion!: HasManyHasAssociationMixin<Question, number>;
  public hasQuestions!: HasManyHasAssociationsMixin<Question, number>;
  public setQuestions!: HasManySetAssociationsMixin<Question, number>;
  public addQuestion!: HasManyAddAssociationMixin<Question, number>;
  public addQuestions!: HasManyAddAssociationsMixin<Question, number>;
  public removeQuestion!: HasManyRemoveAssociationMixin<Question, number>;
  public removeQuestions!: HasManyRemoveAssociationsMixin<Question, number>;
  public createQuestion!: HasManyCreateAssociationMixin<Question>;

  public quotas?: Quota[];
  public getQuotas!: HasManyGetAssociationsMixin<Quota>;
  public countQuotas!: HasManyCountAssociationsMixin;
  public hasQuota!: HasManyHasAssociationMixin<Quota, number>;
  public hasQuotas!: HasManyHasAssociationsMixin<Quota, number>;
  public setQuotas!: HasManySetAssociationsMixin<Quota, number>;
  public addQuota!: HasManyAddAssociationMixin<Quota, number>;
  public addQuotas!: HasManyAddAssociationsMixin<Quota, number>;
  public removeQuota!: HasManyRemoveAssociationMixin<Quota, number>;
  public removeQuotas!: HasManyRemoveAssociationsMixin<Quota, number>;
  public createQuota!: HasManyCreateAssociationMixin<Quota>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (this: IlmoApplication) {
  const sequelize = this.get('sequelize');

  Event.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      registrationStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      registrationEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      openQuotaSize: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
        defaultValue: 0,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      facebookUrl: {
        type: DataTypes.STRING,
      },
      webpageUrl: {
        type: DataTypes.STRING,
      },
      draft: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      signupsPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verificationEmail: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'event',
      freezeTableName: true,
      paranoid: true,
      // by default, show events that:
      defaultScope: {
        where: {
          [Op.and]: {
            // are not drafts,
            draft: false,
            // and either:
            date: {
              [Op.or]: {
                // have no date or
                [Op.eq]: null,
                // happen later than a week ago
                [Op.gt]: moment()
                  .tz('Europe/Helsinki')
                  .subtract(7, 'days')
                  .format(),
              },
            },
          },
        },
      },
    },
  );

  return Event;
}
