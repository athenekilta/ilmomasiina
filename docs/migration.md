This file contains SQL scripts for migrating data from the Athene-created version of Ilmomasiina.

**Please make full backups of your data before proceeding with this migration.**

## MariaDB/MySQL

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
MODIFY `id` CHAR(12) NOT NULL,
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
```
