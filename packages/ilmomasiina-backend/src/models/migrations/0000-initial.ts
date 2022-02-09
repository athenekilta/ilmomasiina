import { DataTypes, Sequelize } from 'sequelize';
import { RunnableMigration } from 'umzug';

// Constant from ../randomId
const RANDOM_ID_LENGTH = 12;

const migration: RunnableMigration<Sequelize> = {
  name: '0000-initial',
  async up({ context: sequelize }) {
    const query = sequelize.getQueryInterface();
    await query.createTable(
      'event',
      {
        id: {
          type: DataTypes.CHAR(RANDOM_ID_LENGTH),
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
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
        category: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '',
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
        nameQuestion: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        emailQuestion: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        verificationEmail: {
          type: DataTypes.TEXT,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
        },
      },
    );
    await query.createTable(
      'quota',
      {
        id: {
          type: DataTypes.CHAR(RANDOM_ID_LENGTH),
          primaryKey: true,
        },
        eventId: {
          type: DataTypes.CHAR(RANDOM_ID_LENGTH),
          allowNull: false,
          references: {
            model: 'event',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        order: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        size: {
          type: DataTypes.INTEGER,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
        },
      },
    );
    await query.createTable(
      'signup',
      {
        id: {
          type: DataTypes.CHAR(RANDOM_ID_LENGTH),
          primaryKey: true,
        },
        quotaId: {
          type: DataTypes.CHAR(RANDOM_ID_LENGTH),
          allowNull: false,
          references: {
            model: 'quota',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        firstName: {
          type: DataTypes.STRING,
        },
        lastName: {
          type: DataTypes.STRING,
        },
        namePublic: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        email: {
          type: DataTypes.STRING,
        },
        confirmedAt: {
          type: DataTypes.DATE(3),
        },
        status: {
          type: DataTypes.ENUM('in-quota', 'in-open', 'in-queue'),
        },
        position: {
          type: DataTypes.INTEGER,
        },
        createdAt: {
          type: DataTypes.DATE(3),
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
        },
      },
    );
    await query.createTable(
      'question',
      {
        id: {
          type: DataTypes.CHAR(RANDOM_ID_LENGTH),
          primaryKey: true,
        },
        eventId: {
          type: DataTypes.CHAR(RANDOM_ID_LENGTH),
          allowNull: false,
          references: {
            model: 'event',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        order: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        question: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM('text', 'textarea', 'number', 'select', 'checkbox'),
          allowNull: false,
        },
        options: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        required: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        public: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
        },
      },
    );
    await query.createTable(
      'answer',
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        questionId: {
          type: DataTypes.CHAR(RANDOM_ID_LENGTH),
          allowNull: false,
          references: {
            model: 'question',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        signupId: {
          type: DataTypes.CHAR(RANDOM_ID_LENGTH),
          allowNull: false,
          references: {
            model: 'signup',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        answer: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
        },
      },
    );
    await query.createTable(
      'user',
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
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
