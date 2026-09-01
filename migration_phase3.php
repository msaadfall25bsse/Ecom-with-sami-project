<?php
require_once __DIR__ . "/config/config.php";
require_once __DIR__ . "/core/Database.php";

try {
    $db = Database::getInstance()->getConnection();

    $db->exec("CREATE TABLE IF NOT EXISTS `download_center` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `title` varchar(255) NOT NULL,
      `file_path` varchar(255) NOT NULL,
      `description` text,
      `sort_order` int(11) DEFAULT '0',
      `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("CREATE TABLE IF NOT EXISTS `important_links` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `title` varchar(255) NOT NULL,
      `url` varchar(255) NOT NULL,
      `description` text,
      `sort_order` int(11) DEFAULT '0',
      `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("CREATE TABLE IF NOT EXISTS `settings` (
      `setting_key` varchar(50) NOT NULL,
      `setting_value` text,
      PRIMARY KEY (`setting_key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    echo "Migration completed successfully!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

