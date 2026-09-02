<?php
require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/core/Database.php';

$conn = new PDO("mysql:host=localhost;dbname=sami_course", "root", "");
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$queries = [
    "CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        rating INT DEFAULT 5,
        review_text TEXT NOT NULL,
        image_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    "CREATE TABLE IF NOT EXISTS video_testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        video_url VARCHAR(500) NOT NULL,
        thumbnail_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    "CREATE TABLE IF NOT EXISTS earning_proofs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    "CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT
    )"
];

foreach ($queries as $query) {
    try {
        $stmt = $conn->prepare($query);
        $stmt->execute();
        echo "Executed: " . substr($query, 0, 50) . "...\n";
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}

// Insert default settings if they don't exist
$defaultSettings = [
    'course_price' => '3900',
    'course_original_price' => '32500',
    'hero_video_type' => 'youtube', // 'youtube' or 'local'
    'hero_video_url' => 'https://www.youtube.com/embed/9coOU5ea3nk?rel=0',
    'announcement_text' => '📞 Have questions? Call or WhatsApp us: 0300-0000000 | ENROLLMENTS ARE OPEN NOW',
    'popup_text' => 'Someone from Lahore just bought the Ecom With Sami course!'
];

$stmt = $conn->prepare("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (:key, :val)");
foreach ($defaultSettings as $key => $val) {
    $stmt->execute(['key' => $key, 'val' => $val]);
}
echo "Default settings inserted.\n";
echo "Done.\n";
