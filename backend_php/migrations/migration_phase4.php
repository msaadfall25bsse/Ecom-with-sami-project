<?php
require_once dirname(__DIR__) . "/config/config.php";
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("ALTER TABLE lessons ADD COLUMN offline_zip_url VARCHAR(500) NULL AFTER attachment_path");
    echo "<h1>Migration Phase 4 Successful!</h1>";
} catch(PDOException $e) {
    if (strpos($e->getMessage(), "Duplicate column name") !== false) {
        echo "<h1>Migration already applied.</h1>";
    } else {
        echo "<h1>Migration Failed!</h1><p>" . $e->getMessage() . "</p>";
    }
}
