-- Drops the database if it exists currently --
DROP DATABASE IF EXISTS `project2_db`;
-- create db --
CREATE DATABASE `project2_db`;

-- CREATE TABLE IF NOT EXISTS `sessions` (
--   `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
--   `expires` int(11) unsigned NOT NULL,
--   `data` text COLLATE utf8mb4_bin,
--   PRIMARY KEY (`session_id`)
-- ) ENGINE=InnoDB
