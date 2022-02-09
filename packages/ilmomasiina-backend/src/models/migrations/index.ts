import { Sequelize } from 'sequelize';
import { RunnableMigration } from 'umzug';

import _0000_initial from './0000-initial';

const migrations: RunnableMigration<Sequelize>[] = [
  _0000_initial,
];

export default migrations;
