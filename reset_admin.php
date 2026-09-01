<?php
require_once 'config/config.php';

try {
    $db = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $password = 'admin123';
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Update admin password
    $stmt = $db->prepare("UPDATE admins SET password = :password WHERE username = 'admin'");
    $stmt->execute(['password' => $hashedPassword]);

    echo "<h1>Admin password has been reset!</h1>";
    echo "<p><strong>Username:</strong> admin</p>";
    echo "<p><strong>New Password:</strong> admin123</p>";
    echo "<a href='".BASE_URL."/admin'>Click here to login</a>";
    
    // Delete this file after running
    @unlink(__FILE__);

} catch(PDOException $e) {
    echo "Database Error: " . $e->getMessage();
}
