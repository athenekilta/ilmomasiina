import { DataTypes, Sequelize } from 'sequelize';
import { RunnableMigration } from 'umzug';

// Constant from ../randomId
const RANDOM_ID_LENGTH = 12;

const migration: RunnableMigration<Sequelize> = {
  name: '0001-add-audit-logs',
  async up({ context: sequelize }) {
    const query = sequelize.getQueryInterface();
    await query.createTable(
      'auditlog',
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
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
    );
  },
};

export default migration;
