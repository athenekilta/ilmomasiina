import { Sequelize } from 'sequelize';
import { RunnableMigration } from 'umzug';

import _0000_initial from './0000-initial';
import _0001_add_audit_logs from './0001-add-audit-logs';

const migrations: RunnableMigration<Sequelize>[] = [
  _0000_initial,
  _0001_add_audit_logs,
];

export default migrations;
