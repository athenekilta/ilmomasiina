This file contains SQL scripts for migrating data from the Athene-created version of Ilmomasiina.

**Please make full backups of your data before proceeding with this migration.**

## MariaDB/MySQL

```sql
ALTER TABLE `event` ADD `slug` VARCHAR(255) NOT NULL AFTER `title`;
UPDATE `event` SET `slug` = CONVERT(`id`, CHAR);
ALTER TABLE `event` ADD CONSTRAINT UNIQUE (`slug`);
```
