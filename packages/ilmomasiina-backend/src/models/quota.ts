import {
  DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin,
  HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Model, Optional, Sequelize,
} from 'sequelize';

import QuotaAttributes from '@tietokilta/ilmomasiina-models/src/models/quota';
import { Event } from './event';
import { generateRandomId, RANDOM_ID_LENGTH } from './randomId';
import { Signup } from './signup';

export interface QuotaCreationAttributes extends Optional<QuotaAttributes, 'id'> {}

export class Quota extends Model<QuotaAttributes, QuotaCreationAttributes> implements QuotaAttributes {
  public id!: string;
  public order!: number;
  public title!: string;
  public size!: number | null;

  public eventId!: Event['id'];
  public event?: Event;
  public getEvent!: HasOneGetAssociationMixin<Event>;
  public setEvent!: HasOneSetAssociationMixin<Event, Event['id']>;
  public createEvent!: HasOneCreateAssociationMixin<Event>;

  public signups?: Signup[];
  public getSignups!: HasManyGetAssociationsMixin<Signup>;
  public countSignups!: HasManyCountAssociationsMixin;
  public hasSignup!: HasManyHasAssociationMixin<Signup, Signup['id']>;
  public hasSignups!: HasManyHasAssociationsMixin<Signup, Signup['id']>;
  public setSignups!: HasManySetAssociationsMixin<Signup, Signup['id']>;
  public addSignup!: HasManyAddAssociationMixin<Signup, Signup['id']>;
  public addSignups!: HasManyAddAssociationsMixin<Signup, Signup['id']>;
  public removeSignup!: HasManyRemoveAssociationMixin<Signup, Signup['id']>;
  public removeSignups!: HasManyRemoveAssociationsMixin<Signup, Signup['id']>;
  public createSignup!: HasManyCreateAssociationMixin<Signup>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual columns for some queries (TODO: is there a cleaner way?)
  public readonly signupCount?: number;
}

export default function setupQuotaModel(sequelize: Sequelize) {
  Quota.init({
    id: {
      type: DataTypes.CHAR(RANDOM_ID_LENGTH),
      primaryKey: true,
      defaultValue: generateRandomId,
    },
    eventId: {
      type: DataTypes.CHAR(RANDOM_ID_LENGTH),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    size: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
      },
    },
    signupCount: {
      type: DataTypes.VIRTUAL,
    },
  }, {
    sequelize,
    modelName: 'quota',
    // Apparently 'quota' is plural of 'quotum', and sequelize + node-inflection
    // would _really_ like to call our foreign key 'quotumId'.
    name: {
      singular: 'quota',
      plural: 'quotas',
    },
    freezeTableName: true,
    paranoid: true,
  });

  return Quota;
}
