<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/core/Database.php';

try {
    $db = Database::getInstance()->getConnection();
    $db->exec("ALTER TABLE settings MODIFY COLUMN setting_value TEXT");
    echo "Successfully altered setting_value to TEXT.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
