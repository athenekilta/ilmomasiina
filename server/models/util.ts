/* eslint-disable import/prefer-default-export */
import { Event } from './event';

/**
 * Portable way to sort NULLs first across databases.
 *
 * Postgres considers NULLs greater than all other values, MySQL and SQLite consider them less than all other values.
 * https://www.postgresql.org/docs/8.3/queries-order.html
 * https://dev.mysql.com/doc/refman/8.0/en/working-with-null.html
 * https://www.sqlite.org/datatype3.html#comparisons
 */
export function ascNullsFirst() {
  if (Event.sequelize!.getDialect() === 'postgres') {
    return 'ASC NULLS FIRST';
  }
  return 'ASC';
}
