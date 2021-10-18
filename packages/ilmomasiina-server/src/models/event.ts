import moment from 'moment-timezone';
import {
  DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, Op, Optional,
} from 'sequelize';

import EventAttributes from '@tietokilta/ilmomasiina-api/src/models/event';
import { IlmoApplication } from '../defs';
import { Question } from './question';
import { Quota } from './quota';
import { generateRandomId, RANDOM_ID_LENGTH } from './randomId';

export interface EventCreationAttributes
  extends Optional<EventAttributes, 'id' | 'openQuotaSize' | 'description' | 'price' | 'location'
  | 'facebookUrl' | 'webpageUrl' | 'draft' | 'listed' | 'signupsPublic' | 'verificationEmail'> {}

export class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: string;
  public title!: string;
  public slug!: string;
  public date!: Date | null;
  public registrationStartDate!: Date | null;
  public registrationEndDate!: Date | null;
  public openQuotaSize!: number;
  public description!: string | null;
  public price!: string | null;
  public location!: string | null;
  public facebookUrl!: string | null;
  public webpageUrl!: string | null;
  public draft!: boolean;
  public listed!: boolean;
  public signupsPublic!: boolean;
  public verificationEmail!: string | null;

  public questions?: Question[];
  public getQuestions!: HasManyGetAssociationsMixin<Question>;
  public countQuestions!: HasManyCountAssociationsMixin;
  public hasQuestion!: HasManyHasAssociationMixin<Question, Question['id']>;
  public hasQuestions!: HasManyHasAssociationsMixin<Question, Question['id']>;
  public setQuestions!: HasManySetAssociationsMixin<Question, Question['id']>;
  public addQuestion!: HasManyAddAssociationMixin<Question, Question['id']>;
  public addQuestions!: HasManyAddAssociationsMixin<Question, Question['id']>;
  public removeQuestion!: HasManyRemoveAssociationMixin<Question, Question['id']>;
  public removeQuestions!: HasManyRemoveAssociationsMixin<Question, Question['id']>;
  public createQuestion!: HasManyCreateAssociationMixin<Question>;

  public quotas?: Quota[];
  public getQuotas!: HasManyGetAssociationsMixin<Quota>;
  public countQuotas!: HasManyCountAssociationsMixin;
  public hasQuota!: HasManyHasAssociationMixin<Quota, Quota['id']>;
  public hasQuotas!: HasManyHasAssociationsMixin<Quota, Quota['id']>;
  public setQuotas!: HasManySetAssociationsMixin<Quota, Quota['id']>;
  public addQuota!: HasManyAddAssociationMixin<Quota, Quota['id']>;
  public addQuotas!: HasManyAddAssociationsMixin<Quota, Quota['id']>;
  public removeQuota!: HasManyRemoveAssociationMixin<Quota, Quota['id']>;
  public removeQuotas!: HasManyRemoveAssociationsMixin<Quota, Quota['id']>;
  public createQuota!: HasManyCreateAssociationMixin<Quota>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function setupEventModel(this: IlmoApplication) {
  const sequelize = this.get('sequelize');

  Event.init(
    {
      id: {
        type: DataTypes.CHAR(RANDOM_ID_LENGTH),
        primaryKey: true,
        defaultValue: generateRandomId,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          is: /^[A-Za-z0-9_-]+$/,
        },
      },
      date: {
        type: DataTypes.DATE,
      },
      registrationStartDate: {
        type: DataTypes.DATE,
      },
      registrationEndDate: {
        type: DataTypes.DATE,
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
      listed: {
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
      validate: {
        hasDateOrRegistration() {
          if (this.date === null && this.registrationStartDate === null) {
            throw new Error('either date or registrationStartDate/registrationEndDate must be set');
          }
          if ((this.registrationStartDate === null) !== (this.registrationEndDate === null)) {
            throw new Error('only neither or both of registrationStartDate and registrationEndDate may be set');
          }
        },
      },
      // by default, show events that:
      defaultScope: {
        where: {
          [Op.and]: {
            // are not drafts,
            draft: false,
            // and either:
            [Op.or]: {
              // have no date and closed less than a week ago
              [Op.and]: {
                date: null,
                registrationEndDate: {
                  [Op.gt]: moment()
                    .tz('Europe/Helsinki')
                    .subtract(7, 'days')
                    .format(),
                },
              },
              // or happen later than a week ago
              date: {
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
