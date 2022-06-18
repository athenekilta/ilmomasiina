import {
  DataTypes, Model, Optional, Sequelize,
} from 'sequelize';

import AuditLogAttributes from '@tietokilta/ilmomasiina-models/src/models/auditlog';
import { RANDOM_ID_LENGTH } from './randomId';

export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id'> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: number;
  public user!: string | null;
  public ipAddress!: string;
  public action!: string;
  public eventId!: string | null;
  public eventName!: string | null;
  public signupId!: string | null;
  public signupName!: string | null;
  public extra!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function setupAuditLogModel(sequelize: Sequelize) {
  AuditLog.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      eventId: {
        type: DataTypes.CHAR(RANDOM_ID_LENGTH),
        allowNull: true,
      },
      eventName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      signupId: {
        type: DataTypes.CHAR(RANDOM_ID_LENGTH),
        allowNull: true,
      },
      signupName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      extra: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'auditlog',
      freezeTableName: true,
    },
  );

  return AuditLog;
}
