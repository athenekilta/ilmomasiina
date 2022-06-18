import { DataTypes, Sequelize } from 'sequelize';
import { RunnableMigration } from 'umzug';

const migration: RunnableMigration<Sequelize> = {
  name: '0002-add-event-endDate',
  async up({ context: sequelize }) {
    const query = sequelize.getQueryInterface();
    await query.addColumn(
      'event',
      'endDate',
      {
        type: DataTypes.DATE,
      },
    );
  },
};

export default migration;
