# Migration

This file documents the migration process from the Athene-created version of Ilmomasiina to the new one.

## Migration script

The below SQL script migrates the database schema. It is written for MySQL/MariaDB.
Scripts for other databases will be created later.

There will be more automatic migration tools when we reach production, but the initial migration will likely stay
as a script.

**Please make full backups of your data before proceeding with this migration.**

```sql
-- add slug support

ALTER TABLE `event`
ADD `slug` VARCHAR(255) NOT NULL AFTER `title`;
UPDATE `event`
SET `slug` = CONVERT(`id`, CHAR);
ALTER TABLE `event`
ADD CONSTRAINT UNIQUE (`slug`);

-- change ids to randomized strings

ALTER TABLE `question`
DROP CONSTRAINT `question_ibfk_1`;
ALTER TABLE `quota`
DROP CONSTRAINT `quota_ibfk_1`;
ALTER TABLE `signup`
DROP CONSTRAINT `signup_ibfk_1`;
ALTER TABLE `answer`
DROP CONSTRAINT `answer_ibfk_1`,
DROP CONSTRAINT `answer_ibfk_2`;

ALTER TABLE `event`
MODIFY `id` CHAR(12) NOT NULL;
ALTER TABLE `question`
MODIFY `id` CHAR(12) NOT NULL,
MODIFY `eventId` CHAR(12) NOT NULL;
ALTER TABLE `quota`
MODIFY `id` CHAR(12) NOT NULL,
MODIFY `eventId` CHAR(12) NOT NULL;
ALTER TABLE `signup`
MODIFY `id` CHAR(12) NOT NULL,
MODIFY `quotaId` CHAR(12) NOT NULL;
ALTER TABLE `answer`
MODIFY `signupId` CHAR(12) NOT NULL,
MODIFY `questionId` CHAR(12) NOT NULL;

ALTER TABLE `question`
ADD FOREIGN KEY `question_ibfk_1` (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `quota`
ADD FOREIGN KEY `quota_ibfk_1` (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `signup`
ADD FOREIGN KEY `signup_ibfk_1` (`quotaId`) REFERENCES `quota` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `answer`
ADD FOREIGN KEY `answer_ibfk_1` (`signupId`) REFERENCES `signup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD FOREIGN KEY `answer_ibfk_2` (`questionId`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- add reordering support to questions and quotas

ALTER TABLE `question`
ADD `order` INTEGER NOT NULL AFTER `eventId`;
ALTER TABLE `quota`
ADD `order` INTEGER NOT NULL AFTER `eventId`;

-- add listed attribute

ALTER TABLE `event`
ADD `listed` BOOLEAN NOT NULL DEFAULT 1 AFTER `draft`;

-- store status and position in signups

ALTER TABLE `signup`
ADD `status` ENUM('in-quota', 'in-open', 'in-queue') DEFAULT NULL AFTER `confirmedAt`,
ADD `position` INTEGER DEFAULT NULL AFTER `status`;

-- allow events without signup and vice versa

ALTER TABLE `event`
MODIFY `date` DATETIME DEFAULT NULL,
MODIFY `registrationStartDate` DATETIME DEFAULT NULL,
MODIFY `registrationEndDate` DATETIME DEFAULT NULL;

-- add event categories

ALTER TABLE `event`
ADD `category` VARCHAR(255) NOT NULL DEFAULT '' AFTER `webpageUrl`;

-- make names optional in signups

ALTER TABLE `event`
ADD `nameQuestion` BOOLEAN NOT NULL DEFAULT 1 AFTER `signupsPublic`,
ADD `emailQuestion` BOOLEAN NOT NULL DEFAULT 1 AFTER `signupsPublic`;

-- allow hiding names in signups

ALTER TABLE `signup`
ADD `namePublic` BOOLEAN NOT NULL DEFAULT 0 AFTER `lastName`;
-- keep names public in previously existing signups
UPDATE `signup`
SET `namePublic` = 1;

-- add audit log
CREATE TABLE `auditlog` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(255) DEFAULT NULL,
  `ipAddress` VARCHAR(64) NOT NULL,
  `action` VARCHAR(32) NOT NULL,
  `details` TEXT NOT NULL DEFAULT '',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);

-- add end date to events

ALTER TABLE `event`
ADD `endDate` DATETIME DEFAULT NULL AFTER `date`;

-- change events with quotas with size 0 to have `null` size meaning unlimited.
UPDATE `quota`
SET `size` = NULL WHERE `size` = 0;

```
