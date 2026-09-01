<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/core/Database.php';

$db = Database::getInstance()->getConnection();
try {
    $stmt = $db->query("SELECT 1 FROM user_progress LIMIT 1");
    echo "Table user_progress EXISTS.";
} catch (Exception $e) {
    echo "Table user_progress DOES NOT EXIST: " . $e->getMessage();
}
