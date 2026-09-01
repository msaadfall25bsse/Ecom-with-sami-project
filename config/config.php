<?php
// === HOSTINGER LIVE DATABASE CREDENTIALS ===
define('DB_HOST', 'localhost');
define('DB_USER', 'u787683477_ecom');
define('DB_PASS', '33313234Aa@33');
define('DB_NAME', 'u787683477_ecom');

// Auto-detect BASE_URL safely (prevents errors on Hostinger)
$isHttps = false;
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    $isHttps = true;
} elseif (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443) {
    $isHttps = true;
}
$protocol = $isHttps ? "https://" : "http://";

$domainName = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';

// Adjust this if you upload your website to a subfolder on Hostinger
// Example: If your site is on "yourdomain.com/course", change it below.
if ($domainName === 'localhost' || $domainName === '127.0.0.1') {
    define('BASE_URL', 'http://localhost/withsami');
} else {
    // Force HTTPS but use the exact domain they are on (www or non-www) to prevent 301 redirects that drop POST data
    define('BASE_URL', 'https://' . $domainName);
}

define('APP_ROOT', dirname(dirname(__FILE__)));

// === SMTP / GMAIL CONFIGURATION ===
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 465); // 465 for SSL, 587 for TLS
define('SMTP_USER', 'hadiw4771@gmail.com');
define('SMTP_PASS', 'nvqh oask jnzj xznv'); // App Password
define('SMTP_FROM_EMAIL', 'hadiw4771@gmail.com');
define('SMTP_FROM_NAME', 'ECOM WITH SAMI');
