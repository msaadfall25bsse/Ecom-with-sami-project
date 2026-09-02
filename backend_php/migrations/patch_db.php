<?php
require_once dirname(__DIR__) . '/config/config.php';
try {
    $db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME, DB_USER, DB_PASS);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if column exists first
    $stmt = $db->query("SHOW COLUMNS FROM lessons LIKE 'attachment_path'");
    if ($stmt->rowCount() == 0) {
        $db->exec("ALTER TABLE lessons ADD COLUMN attachment_path VARCHAR(255) DEFAULT NULL AFTER duration");
        echo "Column attachment_path added successfully.\n";
    } else {
        echo "Column attachment_path already exists.\n";
    }
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
