import {
  DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin,
  HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Model, Optional,
} from 'sequelize';
import { IlmoApplication } from '../defs';
import { Event } from './event';
import { Signup } from './signup';

export interface QuotaAttributes {
  id: number;
  title: string;
  size: number;
}

export interface QuotaCreationAttributes extends Optional<QuotaAttributes, 'id'> {}

export class Quota extends Model<QuotaAttributes, QuotaCreationAttributes> implements QuotaAttributes {
  public id!: number;
  public title!: string;
  public size!: number;

  public eventId!: number;
  public event?: Event;
  public getEvent!: HasOneGetAssociationMixin<Event>;
  public setEvent!: HasOneSetAssociationMixin<Event, number>;
  public createEvent!: HasOneCreateAssociationMixin<Event>;

  public signups?: Signup[];
  public getSignups!: HasManyGetAssociationsMixin<Signup>;
  public countSignups!: HasManyCountAssociationsMixin;
  public hasSignup!: HasManyHasAssociationMixin<Signup, number>;
  public hasSignups!: HasManyHasAssociationsMixin<Signup, number>;
  public setSignups!: HasManySetAssociationsMixin<Signup, number>;
  public addSignup!: HasManyAddAssociationMixin<Signup, number>;
  public addSignups!: HasManyAddAssociationsMixin<Signup, number>;
  public removeSignup!: HasManyRemoveAssociationMixin<Signup, number>;
  public removeSignups!: HasManyRemoveAssociationsMixin<Signup, number>;
  public createSignup!: HasManyCreateAssociationMixin<Signup>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual columns for some queries (TODO: is there a cleaner way?)
  public readonly signupsBefore?: number;
}

export default function (this: IlmoApplication) {
  const sequelize = this.get('sequelize');

  Quota.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'quota',
    freezeTableName: true,
    paranoid: true,
  });

  return Quota;
}
