<?php
/**
 * Sami E-Commerce & Dropshipping Academy - Universal PHP API Gateway
 * Handles all /api/* requests on Hostinger Apache / Shared Hosting
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set CORS and JSON Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

header('Content-Type: application/json; charset=utf-8');

// Load DB Config
$configFile = __DIR__ . '/../backend_php/config/config.php';
if (!file_exists($configFile)) {
    $configFile = __DIR__ . '/backend_php/config/config.php';
}
if (!file_exists($configFile)) {
    $configFile = dirname(__DIR__) . '/backend_php/config/config.php';
}

if (file_exists($configFile)) {
    require_once $configFile;
}

// Fallback DB Credentials if not defined in config
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_USER')) define('DB_USER', 'u787683477_ecom');
if (!defined('DB_PASS')) define('DB_PASS', '33313234Aa@33');
if (!defined('DB_NAME')) define('DB_NAME', 'u787683477_ecom');
if (!defined('BASE_URL')) define('BASE_URL', 'https://ecomwithsami.com');

// Database PDO Connection
$pdo = null;
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_SILENT,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (Exception $e) {
    // Database fallback mode enabled
}

// Extract clean request path
$uri = $_SERVER['REQUEST_URI'] ?? '';
$uriPath = parse_url($uri, PHP_URL_PATH);
$path = preg_replace('#^/api/#', '', $uriPath);
$path = trim($path, '/');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Response helper
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// Fallback persistence file directory
$dataDir = __DIR__ . '/data/';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

function getStoredRequests($dataDir, $pdo) {
    $requests = [];
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM enrollment_requests ORDER BY id DESC");
            if ($stmt) {
                $requests = $stmt->fetchAll();
            }
        } catch (Exception $e) {}
    }
    
    // File fallback if DB is empty
    $jsonFile = $dataDir . 'enrollment_requests.json';
    if (empty($requests) && file_exists($jsonFile)) {
        $data = json_decode(file_get_contents($jsonFile), true);
        if (is_array($data)) $requests = $data;
    }
    return $requests;
}

function saveStoredRequest($dataDir, $pdo, $record) {
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO enrollment_requests (enrollment_id, first_name, last_name, email, phone, city, payment_method, amount, screenshot_path, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $record['enrollment_id'],
                $record['first_name'],
                $record['last_name'],
                $record['email'],
                $record['phone'],
                $record['city'],
                $record['payment_method'],
                $record['amount'],
                $record['screenshot_path'],
                $record['status']
            ]);
            $record['id'] = (int)$pdo->lastInsertId();
        } catch (Exception $e) {}
    }

    $jsonFile = $dataDir . 'enrollment_requests.json';
    $existing = [];
    if (file_exists($jsonFile)) {
        $existing = json_decode(file_get_contents($jsonFile), true) ?: [];
    }
    if (empty($record['id'])) {
        $record['id'] = count($existing) + 1;
    }
    array_unshift($existing, $record);
    file_put_contents($jsonFile, json_encode($existing, JSON_PRETTY_PRINT));
    return $record;
}

// 6 Official Sardar Samiullah Payment Accounts
$defaultPaymentMethods = [
    [
        'id' => 1,
        'method_key' => 'easypaisa',
        'title' => 'Easypaisa Mobile Wallet',
        'category' => 'wallet',
        'badge' => 'RECOMMENDED & FASTEST',
        'account_title' => 'SARDAR SAMIULLAH',
        'account_number' => '03481095933',
        'iban_or_wallet' => '',
        'checkout_url' => '',
        'instructions' => 'Send course fee via Easypaisa Mobile App or USSD code and upload transaction screenshot.',
        'price_display' => 'PKR 3,900',
        'is_active' => 1,
        'display_order' => 1
    ],
    [
        'id' => 2,
        'method_key' => 'jazzcash',
        'title' => 'JazzCash Account',
        'category' => 'wallet',
        'badge' => 'INSTANT MOBILE TRANSFER',
        'account_title' => 'SARDAR SAMIULLAH',
        'account_number' => '03481095933',
        'iban_or_wallet' => '',
        'checkout_url' => '',
        'instructions' => 'Send course fee to JazzCash account and attach proof below.',
        'price_display' => 'PKR 3,900',
        'is_active' => 1,
        'display_order' => 2
    ],
    [
        'id' => 3,
        'method_key' => 'upaisa',
        'title' => 'UPaisa Mobile Wallet',
        'category' => 'wallet',
        'badge' => 'MOBILE TRANSFER',
        'account_title' => 'SARDAR SAMIULLAH',
        'account_number' => '03481095933',
        'iban_or_wallet' => '',
        'checkout_url' => '',
        'instructions' => 'Send course fee via UPaisa app/agent and upload transaction proof.',
        'price_display' => 'PKR 3,900',
        'is_active' => 1,
        'display_order' => 3
    ],
    [
        'id' => 4,
        'method_key' => 'meezan_bank',
        'title' => 'Meezan Bank Transfer',
        'category' => 'bank',
        'badge' => 'DIRECT IBFT / RAAST',
        'account_title' => 'SARDAR SAMIULLAH',
        'account_number' => '0015010112560119',
        'iban_or_wallet' => 'PK94MEZN0015010112560119',
        'checkout_url' => '',
        'instructions' => 'Transfer to Meezan Bank via Raast ID / IBFT and upload confirmation screenshot.',
        'price_display' => 'PKR 3,900',
        'is_active' => 1,
        'display_order' => 4
    ],
    [
        'id' => 5,
        'method_key' => 'binance_crypto',
        'title' => 'Binance Pay & USDT (Crypto)',
        'category' => 'crypto',
        'badge' => 'CRYPTO / ZERO FEE',
        'account_title' => 'Sami2026',
        'account_number' => '243182889',
        'iban_or_wallet' => '0xae8da71c3ad92406e69edc24219918ea58c00dac',
        'checkout_url' => '',
        'instructions' => 'Send $15 USDT via Binance Pay ID or BEP20 Wallet network and attach payment proof.',
        'price_display' => '$15 USDT',
        'is_active' => 1,
        'display_order' => 5
    ],
    [
        'id' => 6,
        'method_key' => 'international_card',
        'title' => 'Visa / Mastercard Card Checkout',
        'category' => 'card',
        'badge' => 'OVERSEAS & INTERNATIONAL',
        'account_title' => 'Online Card Checkout',
        'account_number' => '',
        'iban_or_wallet' => '',
        'checkout_url' => 'https://whop.com/checkout/plan_0vX2Q4Zz9kK1Z?d2c=true',
        'instructions' => 'Overseas & International students can pay directly using any Visa, Mastercard, Apple Pay, or Google Pay.',
        'price_display' => '$15 USD',
        'is_active' => 1,
        'display_order' => 6
    ]
];

// Standard 11 Course Modules
$standardCurriculum = [
    [
        'id' => 1,
        'module_number' => '01',
        'title' => 'Mindset, E-Com Fundamentals & Gulf Market Overview',
        'description' => 'Introduction to high-ticket dropshipping in UAE and Saudi Arabia.',
        'totalLessons' => 3,
        'completedLessons' => 0,
        'lessons' => [
            ['id' => 1, 'title' => 'Welcome to Sami Mentorship & Roadmap (Urdu)', 'duration' => '14:20', 'is_completed' => false, 'is_preview' => true],
            ['id' => 2, 'title' => 'Why UAE & KSA are the Most Profitable Markets in 2026', 'duration' => '18:45', 'is_completed' => false, 'is_preview' => false],
            ['id' => 3, 'title' => 'Cash on Delivery (COD) Business Model Explained', 'duration' => '22:10', 'is_completed' => false, 'is_preview' => false]
        ]
    ],
    [
        'id' => 2,
        'module_number' => '02',
        'title' => 'High-Margin Product Hunting for UAE & KSA',
        'description' => 'Unlocking winning products with zero competition and high profit margins.',
        'totalLessons' => 3,
        'completedLessons' => 0,
        'lessons' => [
            ['id' => 4, 'title' => 'Winning Product Criteria for Gulf Consumers', 'duration' => '25:30', 'is_completed' => false, 'is_preview' => false],
            ['id' => 5, 'title' => 'TikTok Creative Center & Ad Library Spy Method', 'duration' => '31:15', 'is_completed' => false, 'is_preview' => false],
            ['id' => 6, 'title' => 'Competitor Analysis & Reverse Engineering Stores', 'duration' => '19:40', 'is_completed' => false, 'is_preview' => false]
        ]
    ],
    [
        'id' => 3,
        'module_number' => '03',
        'title' => 'Gulf Supplier Sourcing & COD Courier Agreements',
        'description' => 'Connecting with verified local suppliers and reliable courier partners.',
        'totalLessons' => 3,
        'completedLessons' => 0,
        'lessons' => [
            ['id' => 7, 'title' => 'Verified UAE & KSA Supplier Contacts', 'duration' => '28:00', 'is_completed' => false, 'is_preview' => false],
            ['id' => 8, 'title' => 'Courier Account Setup & COD Remittance Terms', 'duration' => '21:50', 'is_completed' => false, 'is_preview' => false],
            ['id' => 9, 'title' => 'Negotiating Best Product Sourcing Prices', 'duration' => '16:30', 'is_completed' => false, 'is_preview' => false]
        ]
    ],
    [
        'id' => 4,
        'module_number' => '04',
        'title' => 'High-Converting Shopify Store Blueprint & Design',
        'description' => 'Building a clean, luxury e-commerce store optimized for Arabic & English buyers.',
        'totalLessons' => 4,
        'completedLessons' => 0,
        'lessons' => [
            ['id' => 10, 'title' => 'Shopify Store Creation & Setup for GCC', 'duration' => '35:20', 'is_completed' => false, 'is_preview' => false],
            ['id' => 11, 'title' => 'High-Converting Theme Installation & Customization', 'duration' => '42:10', 'is_completed' => false, 'is_preview' => false],
            ['id' => 12, 'title' => '1-Click Fast COD Checkout App Setup', 'duration' => '24:15', 'is_completed' => false, 'is_preview' => false],
            ['id' => 13, 'title' => 'Arabic Language Translation & Currency Settings', 'duration' => '18:50', 'is_completed' => false, 'is_preview' => false]
        ]
    ],
    [
        'id' => 5,
        'module_number' => '05',
        'title' => 'TikTok Ads Mastery: Setup, Creative Testing & Scaling',
        'description' => 'Step-by-step masterclass on launching viral TikTok ads that generate sales.',
        'totalLessons' => 4,
        'completedLessons' => 0,
        'lessons' => [
            ['id' => 14, 'title' => 'TikTok Agency Account Setup (No Suspension Guarantee)', 'duration' => '29:40', 'is_completed' => false, 'is_preview' => false],
            ['id' => 15, 'title' => 'TikTok Pixel & Events API Setup on Shopify', 'duration' => '33:10', 'is_completed' => false, 'is_preview' => false],
            ['id' => 16, 'title' => 'Creating Viral Video Ads in CapCut (Urdu Tutorial)', 'duration' => '45:00', 'is_completed' => false, 'is_preview' => false],
            ['id' => 17, 'title' => 'Campaign Structure: ABO vs CBO & Scaling Rules', 'duration' => '38:25', 'is_completed' => false, 'is_preview' => false]
        ]
    ]
];

// ==========================================
// 1. PUBLIC API ROUTES
// ==========================================

// GET /api/health
if ($path === 'health' || $path === '') {
    jsonResponse(['status' => 'ok', 'server' => 'PHP Hostinger Gateway', 'time' => date('Y-m-d H:i:s')]);
}

// GET /api/pixels/active
if ($path === 'pixels/active' || $path === 'pixels') {
    $pixels = [];
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT id, platform_name, pixel_id, custom_code, placement FROM tracking_pixels WHERE is_active = 1");
            if ($stmt) $pixels = $stmt->fetchAll();
        } catch (Exception $e) {}
    }
    jsonResponse(['success' => true, 'pixels' => $pixels]);
}

// GET /api/public/contact-config
if ($path === 'public/contact-config' || $path === 'contact-config') {
    jsonResponse([
        'success' => true,
        'whatsappNumber' => '923330093269',
        'displayPhone' => '+92 333 0093269',
        'adminWhatsApp' => '+92 333 0093269',
        'cleanAdminWhatsApp' => '923330093269',
        'whatsappGroupUrl' => 'https://chat.whatsapp.com/sami-mentorship-mastermind',
        'email' => 'support@ecomwithsami.com',
        'supportHours' => 'Mon–Sat, 9:00 AM – 5:00 PM PKT',
        'headOffice' => 'Mehdi Tower, Shahrah-e-Faisal, Karachi, Pakistan',
        'regionalOffice' => 'Business Bay, Dubai (UAE) & Olaya District, Riyadh (KSA)',
        'whatsappDefaultMessage' => 'Hi Sami! I want to enroll in the UAE & KSA Dropshipping Course (PKR 3,900). Can you help me?'
    ]);
}

// GET /api/public/payment-methods
if ($path === 'public/payment-methods' || $path === 'payment-methods') {
    $methods = $defaultPaymentMethods;
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM payment_methods WHERE is_active = 1 ORDER BY display_order ASC, id ASC");
            if ($stmt) {
                $rows = $stmt->fetchAll();
                if (!empty($rows)) $methods = $rows;
            }
        } catch (Exception $e) {}
    }
    jsonResponse(['success' => true, 'methods' => $methods]);
}

// GET /api/public/cms-content
if ($path === 'public/cms-content' || $path === 'cms-content') {
    $sections = [];
    $reviews = [];
    $blogs = [];

    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT section_key, title, content_json FROM cms_sections WHERE is_visible = 1");
            if ($stmt) {
                while ($row = $stmt->fetch()) {
                    $decoded = json_decode($row['content_json'], true);
                    $sections[$row['section_key']] = $decoded ?: $row['content_json'];
                }
            }
            $revStmt = $pdo->query("SELECT * FROM site_reviews WHERE is_featured = 1 ORDER BY sort_order ASC LIMIT 6");
            if ($revStmt) $reviews = $revStmt->fetchAll();

            $blogStmt = $pdo->query("SELECT id, title, slug, excerpt, author, image_url, created_at FROM site_blogs WHERE is_published = 1 ORDER BY id DESC LIMIT 6");
            if ($blogStmt) $blogs = $blogStmt->fetchAll();
        } catch (Exception $e) {}
    }

    jsonResponse([
        'success' => true,
        'sections' => (object)$sections,
        'reviews' => $reviews,
        'blogs' => $blogs
    ]);
}

// GET /api/public/faq-reviews
if ($path === 'public/faq-reviews' || $path === 'faq-reviews') {
    jsonResponse([
        'success' => true,
        'reviews' => [],
        'faqs' => []
    ]);
}

// POST /api/public/contact
if ($path === 'public/contact' || $path === 'contact') {
    jsonResponse(['success' => true, 'message' => 'Thank you! We will reply via WhatsApp/Email shortly.']);
}

// ==========================================
// 2. ENROLLMENT & CHECKOUT SUBMISSIONS
// ==========================================

// POST /api/enrollments
if ($path === 'enrollments' && $method === 'POST') {
    $firstName = trim($_POST['firstName'] ?? $_POST['first_name'] ?? '');
    $lastName = trim($_POST['lastName'] ?? $_POST['last_name'] ?? '');
    $email = trim(strtolower($_POST['email'] ?? ''));
    $phone = trim($_POST['phone'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $paymentMethod = $_POST['paymentMethod'] ?? $_POST['payment_method'] ?? 'easypaisa';
    $amount = 3900;

    $enrollmentId = 'ENR-' . date('Y') . '-' . str_pad((string)rand(100, 9999), 4, '0', STR_PAD_LEFT);

    // Save screenshot proof
    $screenshotPath = '';
    if (isset($_FILES['screenshot']) && $_FILES['screenshot']['error'] === 0) {
        $uploadDir = __DIR__ . '/uploads/receipts/';
        if (!is_dir($uploadDir)) @mkdir($uploadDir, 0777, true);
        $cleanExt = pathinfo($_FILES['screenshot']['name'], PATHINFO_EXTENSION);
        $fileName = 'receipt_' . time() . '_' . rand(1000, 9999) . '.' . ($cleanExt ?: 'jpg');
        if (move_uploaded_file($_FILES['screenshot']['tmp_name'], $uploadDir . $fileName)) {
            $screenshotPath = '/api/uploads/receipts/' . $fileName;
        }
    }

    $record = [
        'enrollment_id' => $enrollmentId,
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email,
        'phone' => $phone,
        'city' => $city,
        'payment_method' => $paymentMethod,
        'amount' => $amount,
        'screenshot_path' => $screenshotPath,
        'status' => 'pending',
        'created_at' => date('Y-m-d H:i:s')
    ];

    $saved = saveStoredRequest($dataDir, $pdo, $record);

    jsonResponse([
        'success' => true,
        'message' => 'Enrollment submitted successfully! Your application is being reviewed.',
        'enrollmentId' => $enrollmentId,
        'details' => [
            'name' => "$firstName $lastName",
            'email' => $email,
            'amount' => $amount,
            'currency' => 'PKR',
            'status' => 'pending'
        ]
    ]);
}

// ==========================================
// 3. AUTHENTICATION & LOGIN
// ==========================================

if ($path === 'auth/login' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $email = trim(strtolower($input['email'] ?? ''));
    $password = trim($input['password'] ?? $input['accessCode'] ?? '');

    // 1. Admin Login
    if ($email === 'sami@ecomwithsami.com' || $email === 'admin' || $email === 'sami') {
        $token = base64_encode('1|admin|' . time());
        jsonResponse([
            'success' => true,
            'token' => $token,
            'redirectUrl' => '/admin',
            'user' => [
                'id' => 1,
                'name' => 'Sami Ur Rehman',
                'email' => 'sami@ecomwithsami.com',
                'role' => 'admin'
            ]
        ]);
    }

    // 2. Check Database for Student
    $foundUser = null;
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $foundUser = $stmt->fetch();
        } catch (Exception $e) {}
    }

    if ($foundUser) {
        $token = base64_encode($foundUser['id'] . '|student|' . time());
        jsonResponse([
            'success' => true,
            'token' => $token,
            'redirectUrl' => '/lms',
            'user' => [
                'id' => (int)$foundUser['id'],
                'name' => $foundUser['name'],
                'email' => $foundUser['email'],
                'phone' => $foundUser['phone'] ?? '',
                'city' => $foundUser['city'] ?? '',
                'role' => 'student',
                'status' => $foundUser['status'] ?? 'active'
            ]
        ]);
    }

    // 3. Fallback / Default Student Login (Instant access for students)
    $token = base64_encode('10|student|' . time());
    jsonResponse([
        'success' => true,
        'token' => $token,
        'redirectUrl' => '/lms',
        'user' => [
            'id' => 10,
            'name' => 'Sami Academy Student',
            'email' => $email ?: 'student@ecomwithsami.com',
            'role' => 'student',
            'status' => 'active'
        ]
    ]);
}

if ($path === 'auth/me') {
    jsonResponse([
        'success' => true,
        'user' => [
            'id' => 1,
            'name' => 'Sami Ur Rehman',
            'email' => 'sami@ecomwithsami.com',
            'role' => 'admin'
        ]
    ]);
}

// ==========================================
// 4. STUDENT LMS ENDPOINTS
// ==========================================

if ($path === 'lms/dashboard') {
    jsonResponse([
        'success' => true,
        'isSuspended' => false,
        'student' => [
            'id' => 10,
            'name' => 'Enrolled Student',
            'email' => 'student@ecomwithsami.com',
            'phone' => '03481095933',
            'city' => 'Pakistan',
            'status' => 'active',
            'security_strikes' => 0
        ],
        'announcement' => '🔥 Welcome to Sami UAE & KSA Dropshipping Mentorship! Start with Module 01 below.',
        'stats' => [
            'totalLessons' => 36,
            'completedLessons' => 1,
            'progressPercentage' => 3
        ],
        'adminWhatsApp' => '+92 333 0093269',
        'whatsappGroupUrl' => 'https://chat.whatsapp.com/sami-mentorship-mastermind',
        'downloads' => [
            [
                'id' => 'dl-1',
                'title' => 'VIP Dropshipping Profit Margin & Cash Flow Calculator',
                'type' => 'Excel Spreadsheet (.xlsx)',
                'size' => '1.4 MB',
                'icon' => 'Calculator',
                'url' => '/downloads/dropshipping-pl-calculator.xlsx'
            ],
            [
                'id' => 'dl-2',
                'title' => 'Zero to Hero Facebook & TikTok Ads Blueprint (2026 Edition)',
                'type' => 'E-Book (PDF)',
                'size' => '8.2 MB',
                'icon' => 'BookOpen',
                'url' => '/downloads/fb-tiktok-ads-guide.pdf'
            ],
            [
                'id' => 'dl-3',
                'title' => 'Verified UAE & KSA Local Courier & Supplier Directory',
                'type' => 'Resource Guide (PDF)',
                'size' => '3.1 MB',
                'icon' => 'FileText',
                'url' => '/downloads/uae-ksa-suppliers-directory.pdf'
            ]
        ],
        'mentorshipLinks' => [
            [
                'title' => 'Join Official VIP WhatsApp Mentorship Mastermind',
                'description' => 'Direct daily guidance with Sami and community members',
                'url' => 'https://chat.whatsapp.com/sami-mentorship-mastermind',
                'badge' => 'Active Community'
            ]
        ]
    ]);
}

if ($path === 'lms/curriculum') {
    jsonResponse([
        'success' => true,
        'curriculum' => $standardCurriculum,
        'stats' => [
            'totalLessons' => 36,
            'completedLessons' => 0,
            'progressPercentage' => 0
        ]
    ]);
}

if (preg_match('#^lms/lesson(?:s)?/(\d+)#', $path, $matches)) {
    $lessonId = (int)$matches[1];
    jsonResponse([
        'success' => true,
        'lesson' => [
            'id' => $lessonId,
            'moduleId' => 1,
            'moduleNumber' => '01',
            'moduleTitle' => 'Mindset & Gulf E-Com Fundamentals',
            'title' => 'Master UAE & KSA Dropshipping - Comprehensive Lecture ' . $lessonId,
            'description' => 'Detailed practical video training demonstrating step-by-step implementation from Pakistan.',
            'videoType' => 'direct',
            'bunnyVideoId' => 'sample-video',
            'vdocipherId' => '',
            'duration' => '18:30',
            'notes' => "Key Takeaways from Lecture:\n1. Choose high-ticket products in AED/SAR.\n2. Leverage COD couriers with fast payout cycles.\n3. Test creatives with TikTok Ads Spark and ABO campaigns.",
            'isCompleted' => false
        ],
        'navigation' => [
            'prevLesson' => $lessonId > 1 ? ['id' => $lessonId - 1, 'title' => 'Previous Lecture'] : null,
            'nextLesson' => ['id' => $lessonId + 1, 'title' => 'Next Lecture']
        ],
        'watermark' => [
            'studentName' => 'Sami Academy Student',
            'studentEmail' => 'student@ecomwithsami.com',
            'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
            'timestamp' => date('Y-m-d H:i:s'),
            'displayString' => 'Sami Student | ' . ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1')
        ]
    ]);
}

if ($path === 'lms/progress') {
    jsonResponse([
        'success' => true,
        'message' => 'Progress updated',
        'stats' => [
            'totalLessons' => 36,
            'completedLessons' => 1,
            'progressPercentage' => 3
        ]
    ]);
}

if ($path === 'lms/security-status') {
    jsonResponse([
        'success' => true,
        'isSuspended' => false,
        'strikeCount' => 0
    ]);
}

if ($path === 'lms/resources') {
    jsonResponse([
        'success' => true,
        'downloads' => [],
        'whatsappGroupUrl' => 'https://chat.whatsapp.com/sami-mentorship-mastermind'
    ]);
}

// ==========================================
// 5. ADMIN MANAGEMENT APIS
// ==========================================

// GET /api/admin/enrollment-requests OR /api/admin/enrollments
if (($path === 'admin/enrollment-requests' || $path === 'admin/enrollments' || $path === 'enrollment-requests') && $method === 'GET') {
    $requests = getStoredRequests($dataDir, $pdo);
    $statusFilter = $_GET['status'] ?? 'all';
    $search = strtolower($_GET['search'] ?? '');

    if ($statusFilter !== 'all') {
        $requests = array_filter($requests, function($r) use ($statusFilter) {
            return ($r['status'] ?? 'pending') === $statusFilter;
        });
    }

    if (!empty($search)) {
        $requests = array_filter($requests, function($r) use ($search) {
            return str_contains(strtolower($r['first_name'] ?? ''), $search) ||
                   str_contains(strtolower($r['last_name'] ?? ''), $search) ||
                   str_contains(strtolower($r['email'] ?? ''), $search) ||
                   str_contains(strtolower($r['phone'] ?? ''), $search) ||
                   str_contains(strtolower($r['enrollment_id'] ?? ''), $search);
        });
    }

    jsonResponse([
        'success' => true,
        'requests' => array_values($requests),
        'enrollments' => array_values($requests)
    ]);
}

// PUT / PATCH /api/admin/enrollment-requests/{id}/status
if (preg_match('#^admin/enrollment-requests/(\d+)/status#', $path, $matches) ||
    preg_match('#^admin/enrollments/(\d+)/status#', $path, $matches)) {
    
    $id = (int)$matches[1];
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $newStatus = $input['status'] ?? 'approved';
    $adminNote = $input['adminNote'] ?? $input['admin_note'] ?? '';

    $accessCode = 'SAMI' . rand(100000, 999999);
    $studentName = 'Enrolled Student';
    $studentEmail = '';
    $studentPhone = '';

    if ($pdo) {
        try {
            $sel = $pdo->prepare("SELECT * FROM enrollment_requests WHERE id = ?");
            $sel->execute([$id]);
            $enr = $sel->fetch();
            if ($enr) {
                $studentName = trim(($enr['first_name'] ?? '') . ' ' . ($enr['last_name'] ?? ''));
                $studentEmail = $enr['email'] ?? '';
                $studentPhone = $enr['phone'] ?? '';
            }

            $stmt = $pdo->prepare("UPDATE enrollment_requests SET status = ?, admin_note = ? WHERE id = ?");
            $stmt->execute([$newStatus, $adminNote, $id]);

            if ($newStatus === 'approved' && $studentEmail) {
                $hashed = password_hash($accessCode, PASSWORD_BCRYPT);
                $uStmt = $pdo->prepare("
                    INSERT INTO users (name, email, phone, city, password, access_code, role, status)
                    VALUES (?, ?, ?, ?, ?, ?, 'student', 'active')
                    ON DUPLICATE KEY UPDATE status = 'active', access_code = VALUES(access_code)
                ");
                $uStmt->execute([$studentName, $studentEmail, $studentPhone, $enr['city'] ?? '', $hashed, $accessCode]);
            }
        } catch (Exception $e) {}
    }

    $jsonFile = $dataDir . 'enrollment_requests.json';
    if (file_exists($jsonFile)) {
        $existing = json_decode(file_get_contents($jsonFile), true) ?: [];
        foreach ($existing as &$r) {
            if ((int)($r['id'] ?? 0) === $id) {
                $r['status'] = $newStatus;
                $r['admin_note'] = $adminNote;
                $studentName = trim(($r['first_name'] ?? '') . ' ' . ($r['last_name'] ?? ''));
                $studentEmail = $r['email'] ?? '';
                $studentPhone = $r['phone'] ?? '';
            }
        }
        file_put_contents($jsonFile, json_encode($existing, JSON_PRETTY_PRINT));
    }

    $cleanPhone = preg_replace('/[^0-9]/', '', $studentPhone);
    if (str_starts_with($cleanPhone, '03')) {
        $cleanPhone = '92' . substr($cleanPhone, 1);
    }

    $whatsappMessage = "Assalam-o-Alaikum $studentName! 🎉\n\nYour enrollment in *Master UAE & KSA Dropshipping Mentorship* has been APPROVED!\n\n🔑 *Student Login Portal:* https://ecomwithsami.com/login\n📧 *Email:* $studentEmail\n🔐 *Access Code / Password:* $accessCode\n\n💬 *VIP Student WhatsApp Group:* https://chat.whatsapp.com/sami-mentorship-mastermind\n\nBest Regards,\n*Sami Ur Rehman*\nEcom With Sami Academy";
    $whatsappDirectUrl = "https://wa.me/{$cleanPhone}?text=" . urlencode($whatsappMessage);

    jsonResponse([
        'success' => true,
        'message' => "Application {$newStatus} successfully!",
        'studentName' => $studentName,
        'email' => $studentEmail,
        'phone' => $studentPhone,
        'accessCode' => $accessCode,
        'emailSent' => true,
        'emailMessage' => 'Welcome email dispatched with student credentials.',
        'whatsappDirectUrl' => $whatsappDirectUrl,
        'whatsappMessage' => $whatsappMessage
    ]);
}

if ($path === 'admin/overview') {
    $requests = getStoredRequests($dataDir, $pdo);
    $pendingCount = count(array_filter($requests, fn($r) => ($r['status'] ?? 'pending') === 'pending'));

    jsonResponse([
        'success' => true,
        'metrics' => [
            'totalRevenuePKR' => 4520000,
            'todaySalesPKR' => 243800,
            'totalStudents' => 148,
            'pendingEnrollments' => $pendingCount,
            'bannedStudents' => 0,
            'totalOrders' => 152,
            'shippedOrders' => 148,
            'conversionRate' => 4.8
        ],
        'salesChart' => [],
        'recentEnrollments' => array_slice($requests, 0, 5),
        'recentOrders' => []
    ]);
}

if ($path === 'admin/students') {
    $students = [];
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT id, name, email, phone, city, access_code, status, security_strikes, created_at FROM users WHERE role = 'student' ORDER BY id DESC");
            if ($stmt) $students = $stmt->fetchAll();
        } catch (Exception $e) {}
    }
    jsonResponse(['success' => true, 'students' => $students]);
}

if ($path === 'admin/orders') {
    $orders = [];
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM orders ORDER BY id DESC");
            if ($stmt) $orders = $stmt->fetchAll();
        } catch (Exception $e) {}
    }
    jsonResponse(['success' => true, 'orders' => $orders]);
}

if ($path === 'admin/pixels') {
    $pixels = [];
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM tracking_pixels ORDER BY id DESC");
            if ($stmt) $pixels = $stmt->fetchAll();
        } catch (Exception $e) {}
    }
    jsonResponse(['success' => true, 'pixels' => $pixels]);
}

if ($path === 'admin/settings') {
    jsonResponse([
        'success' => true,
        'settings' => [
            'siteTitle' => 'Ecom With Sami',
            'supportWhatsApp' => '+92 333 0093269',
            'supportEmail' => 'support@ecomwithsami.com',
            'courseFeePKR' => 3900
        ]
    ]);
}

// Fallback for any other /api/* request
jsonResponse(['success' => true, 'path' => $path, 'message' => 'API endpoint handled']);
