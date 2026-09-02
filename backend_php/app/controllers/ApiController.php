<?php
class ApiController extends Controller {

    public function __construct() {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
        // Prevent CORS issues if testing from local electron app during dev
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }
    }

    private function respond($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            $input = $_POST;
        }

        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            $this->respond(['success' => false, 'message' => 'Email and password required'], 400);
        }

        $userModel = $this->model('UserModel');
        $user = $userModel->login($email, $password);

        if ($user) {
            // Check if active (assuming role 'student' or 'admin')
            if ($user['role'] !== 'student' && $user['role'] !== 'admin') {
                 $this->respond(['success' => false, 'message' => 'Access denied'], 403);
            }
            
            // Generate a simple secure token
            $token_payload = $user['id'] . '|' . $user['email'];
            $signature = hash_hmac('sha256', $token_payload, DB_PASS);
            $token = base64_encode($token_payload . '|' . $signature);

            $this->respond([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            $this->respond(['success' => false, 'message' => 'Invalid email or password'], 401);
        }
    }

    private function verifyToken() {
        $authHeader = '';
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = trim($_SERVER["REDIRECT_HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            if (isset($requestHeaders['Authorization'])) {
                $authHeader = trim($requestHeaders['Authorization']);
            }
        }

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $decoded = base64_decode($token);
            if ($decoded) {
                $parts = explode('|', $decoded);
                if (count($parts) === 3) {
                    $payload = $parts[0] . '|' . $parts[1];
                    $signature = $parts[2];
                    $expected = hash_hmac('sha256', $payload, DB_PASS);
                    if (hash_equals($expected, $signature)) {
                        return $parts[0]; // Returns user_id
                    }
                }
            }
        }
        $this->respond(['success' => false, 'message' => 'Unauthorized or missing token'], 401);
    }

    public function mark_complete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
             $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $user_id = $this->verifyToken();
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            $input = $_POST;
        }
        $lesson_id = $input['lesson_id'] ?? null;
        if (!$lesson_id) {
            $this->respond(['success' => false, 'message' => 'Lesson ID required'], 400);
        }
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("INSERT IGNORE INTO user_progress (user_id, lesson_id) VALUES (:uid, :lid)");
        $stmt->execute(['uid' => $user_id, 'lid' => $lesson_id]);
        $this->respond(['success' => true]);
    }

    public function modules() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
             $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        
        $user_id = $this->verifyToken();

        $moduleModel = $this->model('ModuleModel');
        $modules = $moduleModel->getAllModules();
        $curriculum = [];

        $settingModel = $this->model('SettingModel');
        $announcement_text = $settingModel->getSetting('announcement_text');
        
        $completed_lessons = $moduleModel->getUserProgress($user_id);
        if (!is_array($completed_lessons)) $completed_lessons = [];
        $total_lessons = $moduleModel->getTotalLessons();

        foreach ($modules as $mod) {
            $lessons = $moduleModel->getLessonsByModuleId($mod['id']);
            $lessonArray = [];
            foreach ($lessons as $les) {
                $video_path = $les['bunny_video_id'];
                if (strpos($video_path, 'public/uploads/videos/') === 0) {
                    $video_path = str_replace('public/', '', $video_path);
                }
                
                $lessonArray[] = [
                    'id' => $les['id'],
                    'title' => $les['title'],
                    'description' => $les['description'],
                    'duration' => $les['duration'],
                    'video_path' => $video_path,
                    'attachment_path' => $les['attachment_path'] ?? null,
                    'offline_zip_url' => $les['offline_zip_url'] ?? null,
                    'is_completed' => in_array($les['id'], $completed_lessons)
                ];
            }
            $curriculum[] = [
                'module' => [
                    'id' => $mod['id'],
                    'title' => $mod['title']
                ],
                'lessons' => $lessonArray
            ];
        }

        $app_update = [
            'android_version' => (int)$settingModel->getSetting('android_version') ?: 10,
            'windows_version' => (int)$settingModel->getSetting('windows_version') ?: 1,
            'android_url' => 'https://ecomwithsami.com/apps',
            'windows_url' => 'https://ecomwithsami.com/apps'
        ];

        $resourceModel = $this->model('ResourceModel');
        $downloads = $resourceModel->getAllDownloads();
        $links = $resourceModel->getAllLinks();

        $this->respond([
            'success' => true,
            'base_url' => BASE_URL,
            'announcement_text' => $announcement_text,
            'app_update' => $app_update,
            'progress' => [
                'completed' => count($completed_lessons),
                'total' => $total_lessons
            ],
            'curriculum' => $curriculum,
            'downloads' => $downloads,
            'links' => $links
        ]);
    }

    // ============================================================
    // NEW API ENDPOINTS FOR REACT FRONTEND
    // ============================================================

    // --- Helper: Verify Admin Token ---
    private function verifyAdminToken() {
        $user_id = $this->verifyToken();
        $userModel = $this->model('UserModel');
        $user = $userModel->getUserById($user_id);
        if (!$user || $user['role'] !== 'admin') {
            $this->respond(['success' => false, 'message' => 'Admin access required'], 403);
        }
        return $user_id;
    }

    // --- PUBLIC ENDPOINTS ---

    public function home() {
        $testimonialModel = $this->model('TestimonialModel');
        $settingModel = $this->model('SettingModel');
        $this->respond([
            'success' => true,
            'base_url' => BASE_URL,
            'reviews' => $testimonialModel->getReviews(),
            'videos' => $testimonialModel->getVideos(),
            'proofs' => $testimonialModel->getProofs(),
            'settings' => $settingModel->getAllSettings()
        ]);
    }

    public function checkout_data() {
        $settingModel = $this->model('SettingModel');
        $this->respond([
            'success' => true,
            'base_url' => BASE_URL,
            'settings' => $settingModel->getAllSettings()
        ]);
    }

    public function submit_order() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $data = [
            'first_name' => $_POST['first_name'] ?? '',
            'last_name' => $_POST['last_name'] ?? '',
            'email' => $_POST['email'] ?? '',
            'phone' => $_POST['phone'] ?? '',
            'city' => $_POST['city'] ?? '',
            'payment_method' => $_POST['payment_method'] ?? '',
            'screenshot_path' => ''
        ];
        if (isset($_FILES['screenshot']) && $_FILES['screenshot']['error'] == 0) {
            $uploadDir = __DIR__ . '/../../public/uploads/receipts/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['screenshot']['name']));
            $targetFile = $uploadDir . $fileName;
            if (move_uploaded_file($_FILES['screenshot']['tmp_name'], $targetFile)) {
                $data['screenshot_path'] = 'public/uploads/receipts/' . $fileName;
            }
        }
        $orderModel = $this->model('OrderModel');
        $orderModel->createOrder($data);
        $this->respond(['success' => true, 'message' => 'Order submitted successfully']);
    }

    public function apps_data() {
        $settingModel = $this->model('SettingModel');
        $this->respond([
            'success' => true,
            'base_url' => BASE_URL,
            'settings' => $settingModel->getAllSettings()
        ]);
    }

    // --- ADMIN LOGIN ---

    public function admin_login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        if (empty($username) || empty($password)) {
            $this->respond(['success' => false, 'message' => 'Username and password required'], 400);
        }
        $adminModel = $this->model('AdminModel');
        $admin = $adminModel->login($username, $password);
        if ($admin) {
            // Create token using admin ID and a special admin email marker
            $token_payload = $admin['id'] . '|admin@' . $admin['username'];
            $signature = hash_hmac('sha256', $token_payload, DB_PASS);
            $token = base64_encode($token_payload . '|' . $signature);
            $this->respond([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $admin['id'],
                    'username' => $admin['username'],
                    'role' => 'admin'
                ]
            ]);
        } else {
            $this->respond(['success' => false, 'message' => 'Invalid username or password'], 401);
        }
    }

    // --- ADMIN DASHBOARD ---

    public function admin_dashboard() {
        $this->verifyToken();
        $orderModel = $this->model('OrderModel');
        $metrics = $orderModel->getDashboardMetrics();
        $recentOrders = array_slice($orderModel->getAllOrders(), 0, 10);
        $this->respond([
            'success' => true,
            'metrics' => $metrics,
            'recentOrders' => $recentOrders
        ]);
    }

    // --- ADMIN ORDERS ---

    public function admin_orders() {
        $this->verifyToken();
        $orderModel = $this->model('OrderModel');
        $this->respond([
            'success' => true,
            'base_url' => BASE_URL,
            'orders' => $orderModel->getAllOrders()
        ]);
    }

    public function admin_update_order() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $orderId = $input['order_id'] ?? null;
        $status = $input['status'] ?? null;
        $studentPassword = $input['student_password'] ?? '12345678';
        $customEmailBody = $input['email_body'] ?? '';
        if (!$orderId || !$status) {
            $this->respond(['success' => false, 'message' => 'Order ID and status required'], 400);
        }
        $orderModel = $this->model('OrderModel');
        $orderModel->updateOrderStatus($orderId, $status);
        if ($status == 'approved') {
            $order = $orderModel->getOrderById($orderId);
            if ($order) {
                $userModel = $this->model('UserModel');
                $name = $order['first_name'] . ' ' . $order['last_name'];
                $isNewUser = false;
                if (!$userModel->getUserByEmail($order['email'])) {
                    $userModel->createUser($name, $order['email'], $studentPassword, 'student');
                    $isNewUser = true;
                }
                if (empty(trim($customEmailBody))) {
                    if ($isNewUser) {
                        $customEmailBody = nl2br("Hello {$name},\n\nYour payment has been successfully approved! You can now access your course dashboard.\n\nYour Login Details:\nEmail: {$order['email']}\nPassword: {$studentPassword}\n\nYou can login by downloading our Windows/Android app or via our website.\n\nBest Regards,\nSami");
                    } else {
                        $customEmailBody = nl2br("Hello {$name},\n\nYour recent payment has been successfully approved. Since you already have an account with us, you can log in using your existing email and password.\n\nEmail: {$order['email']}\n\nYou can login by downloading our Windows/Android app or via our website.\n\nBest Regards,\nSami");
                    }
                }
                $domain = $_SERVER['HTTP_HOST'] ?? 'ecomwithsami.com';
                $domain = str_replace('www.', '', $domain);
                $fromEmail = "no-reply@" . $domain;
                $headers = "From: " . SMTP_FROM_NAME . " <" . $fromEmail . ">" . "\r\n";
                $headers .= "Reply-To: " . SMTP_FROM_EMAIL . "\r\n";
                $headers .= "MIME-Version: 1.0\r\n";
                $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
                $subject = 'Your Course Access Details - Ecom With Sami';
                @mail($order['email'], $subject, $customEmailBody, $headers);
            }
        }
        $this->respond(['success' => true, 'message' => 'Order updated successfully']);
    }

    // --- ADMIN MODULES ---

    public function admin_modules() {
        $this->verifyToken();
        $moduleModel = $this->model('ModuleModel');
        $this->respond([
            'success' => true,
            'modules' => $moduleModel->getAllModules()
        ]);
    }

    public function admin_create_module() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $moduleModel = $this->model('ModuleModel');
        $moduleModel->createModule($input['title'] ?? '', $input['description'] ?? '', $input['sort_order'] ?? 0);
        $this->respond(['success' => true]);
    }

    public function admin_update_module() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $moduleModel = $this->model('ModuleModel');
        $moduleModel->updateModule($input['module_id'], $input['title'], $input['description'], $input['sort_order'] ?? 0);
        $this->respond(['success' => true]);
    }

    public function admin_delete_module() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $moduleModel = $this->model('ModuleModel');
        $moduleModel->deleteModule($input['id']);
        $this->respond(['success' => true]);
    }

    // --- ADMIN LESSONS ---

    public function admin_lessons() {
        $this->verifyToken();
        $module_id = $_GET['module_id'] ?? null;
        $moduleModel = $this->model('ModuleModel');
        $modules = $moduleModel->getAllModules();
        $lessons = [];
        $selected_module = null;
        if ($module_id) {
            $lessons = $moduleModel->getLessonsByModuleId($module_id);
            $selected_module = $moduleModel->getModuleById($module_id);
        } elseif (count($modules) > 0) {
            $module_id = $modules[0]['id'];
            $lessons = $moduleModel->getLessonsByModuleId($module_id);
            $selected_module = $modules[0];
        }
        $this->respond([
            'success' => true,
            'modules' => $modules,
            'lessons' => $lessons,
            'selected_module' => $selected_module
        ]);
    }

    public function admin_create_lesson() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        set_time_limit(0);
        $moduleModel = $this->model('ModuleModel');
        $module_id = $_POST['module_id'] ?? null;
        $title = $_POST['title'] ?? 'Untitled Lesson';
        $description = $_POST['description'] ?? '';
        $duration = $_POST['duration'] ?? '';
        $sort_order = $_POST['sort_order'] ?? 0;
        $is_preview = isset($_POST['is_preview']) ? true : false;
        $vdo_video_id = $_POST['vdo_video_id'] ?? '';
        $uploaded_video_path = $_POST['uploaded_video_path'] ?? '';
        if (empty($vdo_video_id) && !empty($uploaded_video_path)) {
            $vdo_video_id = $uploaded_video_path;
        }
        if (empty($vdo_video_id) && isset($_FILES['video_file']) && $_FILES['video_file']['error'] == UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../public/uploads/videos/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['video_file']['name']));
            $targetFile = $uploadDir . $fileName;
            if (move_uploaded_file($_FILES['video_file']['tmp_name'], $targetFile)) {
                $vdo_video_id = 'public/uploads/videos/' . $fileName;
            }
        }
        $attachment_path = null;
        if (isset($_FILES['attachment_file']) && $_FILES['attachment_file']['error'] == UPLOAD_ERR_OK) {
            $attachDir = __DIR__ . '/../../public/uploads/attachments/';
            if (!is_dir($attachDir)) mkdir($attachDir, 0777, true);
            $attachName = time() . '_' . preg_replace("/[^a-zA-Z0-9.-]/", "", basename($_FILES['attachment_file']['name']));
            if (move_uploaded_file($_FILES['attachment_file']['tmp_name'], $attachDir . $attachName)) {
                $attachment_path = 'public/uploads/attachments/' . $attachName;
            }
        }
        $offline_zip_url = null;
        if (isset($_FILES['offline_zip_file']) && $_FILES['offline_zip_file']['error'] == UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../public/uploads/zips/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['offline_zip_file']['name']));
            if (move_uploaded_file($_FILES['offline_zip_file']['tmp_name'], $uploadDir . $fileName)) {
                $offline_zip_url = 'public/uploads/zips/' . $fileName;
            }
        }
        if (empty($vdo_video_id)) {
            $this->respond(['success' => false, 'message' => 'Please provide a Video ID or upload a file'], 400);
        }
        if ($module_id) {
            $moduleModel->createLesson($module_id, $title, $description, $vdo_video_id, $duration, $sort_order, $is_preview, $attachment_path, $offline_zip_url);
            $this->respond(['success' => true]);
        } else {
            $this->respond(['success' => false, 'message' => 'Module ID is missing'], 400);
        }
    }

    public function admin_update_lesson() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $moduleModel = $this->model('ModuleModel');
        $lesson = $moduleModel->getLessonById($input['lesson_id']);
        if ($lesson) {
            $offline_zip_url = $lesson['offline_zip_url'];
            if (isset($_FILES['offline_zip_file']) && $_FILES['offline_zip_file']['error'] == UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../public/uploads/zips/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['offline_zip_file']['name']));
                if (move_uploaded_file($_FILES['offline_zip_file']['tmp_name'], $uploadDir . $fileName)) {
                    $offline_zip_url = 'public/uploads/zips/' . $fileName;
                }
            }
            $moduleModel->updateLesson(
                $input['lesson_id'],
                $input['title'],
                $input['description'],
                $input['bunny_video_id'],
                $input['duration'],
                $input['sort_order'] ?? 0,
                isset($input['is_preview']) ? true : false,
                $offline_zip_url
            );
            $this->respond(['success' => true]);
        } else {
            $this->respond(['success' => false, 'message' => 'Lesson not found'], 404);
        }
    }

    public function admin_delete_lesson() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $moduleModel = $this->model('ModuleModel');
        $moduleModel->deleteLesson($input['id']);
        $this->respond(['success' => true]);
    }

    public function admin_upload_chunk() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $fileName = $_POST['fileName'] ?? '';
        $chunkIndex = $_POST['chunkIndex'] ?? 0;
        if (empty($fileName) || !isset($_FILES['file'])) {
            $this->respond(['success' => false, 'message' => 'Invalid request'], 400);
        }
        $uploadDir = __DIR__ . '/../../public/uploads/videos/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        $safeFileName = preg_replace("/[^a-zA-Z0-9._-]/", "", basename($fileName));
        $targetFile = $uploadDir . $safeFileName;
        $in = fopen($_FILES['file']['tmp_name'], "rb");
        $out = fopen($targetFile, $chunkIndex == 0 ? "wb" : "ab");
        if ($in && $out) {
            while ($buff = fread($in, 4096)) {
                fwrite($out, $buff);
            }
        }
        fclose($in);
        fclose($out);
        $this->respond(['success' => true, 'chunkIndex' => $chunkIndex, 'path' => 'public/uploads/videos/' . $safeFileName]);
    }

    // --- ADMIN SETTINGS ---

    public function admin_settings() {
        $this->verifyToken();
        $settingModel = $this->model('SettingModel');
        $this->respond([
            'success' => true,
            'settings' => $settingModel->getAllSettings()
        ]);
    }

    public function admin_update_settings() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $settingModel = $this->model('SettingModel');
        $keys = ['android_version', 'windows_version', 'android_update_url', 'windows_update_url', 'course_price', 'course_original_price', 'hero_video_type', 'hero_video_url', 'announcement_text', 'popup_text', 'bank_meezan', 'bank_easypaisa', 'bank_jazzcash', 'bank_meezan_title', 'bank_easypaisa_title', 'bank_jazzcash_title', 'home_hero_title', 'home_hero_subtitle', 'home_hero_desc', 'home_why_dropshipping_title', 'home_what_you_get_title', 'home_instructor_title', 'home_instructor_subtitle', 'home_instructor_desc', 'home_guarantee_title', 'home_guarantee_text', 'home_who_is_for_title', 'home_options_title', 'home_cost_waiting_title', 'home_final_cta_title', 'home_final_cta_subtitle'];
        foreach ($keys as $key) {
            if (isset($input[$key])) {
                $settingModel->updateSetting($key, $input[$key]);
            }
        }
        // Handle Local Video Upload for Hero Section
        if (isset($input['hero_video_type']) && $input['hero_video_type'] == 'local' && isset($_FILES['local_hero_video']) && $_FILES['local_hero_video']['error'] == UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../public/uploads/videos/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['local_hero_video']['name']));
            if (move_uploaded_file($_FILES['local_hero_video']['tmp_name'], $uploadDir . $fileName)) {
                $settingModel->updateSetting('hero_video_url', 'public/uploads/videos/' . $fileName);
            }
        }
        $this->respond(['success' => true]);
    }

    // --- ADMIN TESTIMONIALS ---

    public function admin_testimonials() {
        $this->verifyToken();
        $testimonialModel = $this->model('TestimonialModel');
        $this->respond([
            'success' => true,
            'base_url' => BASE_URL,
            'reviews' => $testimonialModel->getReviews(),
            'videos' => $testimonialModel->getVideos(),
            'proofs' => $testimonialModel->getProofs()
        ]);
    }

    public function admin_add_review() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $testimonialModel = $this->model('TestimonialModel');
        $name = $_POST['student_name'] ?? '';
        $rating = $_POST['rating'] ?? 5;
        $text = $_POST['review_text'] ?? '';
        $imagePath = null;
        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] == UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../public/uploads/images/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = time() . '_' . basename($_FILES['profile_image']['name']);
            if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $uploadDir . $fileName)) {
                $imagePath = 'public/uploads/images/' . $fileName;
            }
        }
        $testimonialModel->addReview($name, $rating, $text, $imagePath);
        $this->respond(['success' => true]);
    }

    public function admin_delete_review() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $testimonialModel = $this->model('TestimonialModel');
        $testimonialModel->deleteReview($input['id']);
        $this->respond(['success' => true]);
    }

    public function admin_add_video() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $testimonialModel = $this->model('TestimonialModel');
        $testimonialModel->addVideo($input['video_url']);
        $this->respond(['success' => true]);
    }

    public function admin_delete_video() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $testimonialModel = $this->model('TestimonialModel');
        $testimonialModel->deleteVideo($input['id']);
        $this->respond(['success' => true]);
    }

    public function admin_add_proof() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $testimonialModel = $this->model('TestimonialModel');
        if (isset($_FILES['proof_image']) && $_FILES['proof_image']['error'] == UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../public/uploads/images/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = time() . '_' . basename($_FILES['proof_image']['name']);
            if (move_uploaded_file($_FILES['proof_image']['tmp_name'], $uploadDir . $fileName)) {
                $testimonialModel->addProof('public/uploads/images/' . $fileName);
            }
        }
        $this->respond(['success' => true]);
    }

    public function admin_delete_proof() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $testimonialModel = $this->model('TestimonialModel');
        $testimonialModel->deleteProof($input['id']);
        $this->respond(['success' => true]);
    }

    // --- ADMIN RESOURCES ---

    public function admin_resources() {
        $this->verifyToken();
        $resourceModel = $this->model('ResourceModel');
        $settingModel = $this->model('SettingModel');
        $this->respond([
            'success' => true,
            'downloads' => $resourceModel->getAllDownloads(),
            'links' => $resourceModel->getAllLinks(),
            'announcement_text' => $settingModel->getSetting('announcement_text')
        ]);
    }

    public function admin_create_download() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $sort_order = $_POST['sort_order'] ?? 0;
        $file_path = '';
        if (isset($_FILES['file']) && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../public/uploads/resources/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = time() . '_' . basename($_FILES['file']['name']);
            if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadDir . $fileName)) {
                $file_path = 'public/uploads/resources/' . $fileName;
            }
        }
        $resourceModel = $this->model('ResourceModel');
        $resourceModel->createDownload($title, $file_path, $description, $sort_order);
        $this->respond(['success' => true]);
    }

    public function admin_delete_download() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $resourceModel = $this->model('ResourceModel');
        $resourceModel->deleteDownload($input['id']);
        $this->respond(['success' => true]);
    }

    public function admin_create_link() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $resourceModel = $this->model('ResourceModel');
        $resourceModel->createLink($input['title'], $input['url'], $input['description'], $input['sort_order'] ?? 0);
        $this->respond(['success' => true]);
    }

    public function admin_delete_link() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $resourceModel = $this->model('ResourceModel');
        $resourceModel->deleteLink($input['id']);
        $this->respond(['success' => true]);
    }

    // --- ADMIN PIXELS ---

    public function admin_pixels() {
        $this->verifyToken();
        $settingModel = $this->model('SettingModel');
        $this->respond([
            'success' => true,
            'settings' => $settingModel->getAllSettings()
        ]);
    }

    public function admin_update_pixels() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $settingModel = $this->model('SettingModel');
        $keys = ['tracking_head', 'tracking_body'];
        foreach ($keys as $key) {
            if (isset($input[$key])) {
                $settingModel->updateSetting($key, $input[$key]);
            }
        }
        $this->respond(['success' => true]);
    }

    // --- STUDENT COURSE DATA ---

    public function student_course() {
        $user_id = $this->verifyToken();
        $moduleModel = $this->model('ModuleModel');
        $modules = $moduleModel->getAllModules();
        $completed_lessons = $moduleModel->getUserProgress($user_id);
        if (!is_array($completed_lessons)) $completed_lessons = [];
        $total_lessons = $moduleModel->getTotalLessons();
        $curriculum = [];
        foreach ($modules as $module) {
            $lessons = $moduleModel->getLessonsByModuleId($module['id']);
            $curriculum[] = [
                'module' => $module,
                'lessons' => $lessons
            ];
        }
        $resourceModel = $this->model('ResourceModel');
        $settingModel = $this->model('SettingModel');
        $this->respond([
            'success' => true,
            'base_url' => BASE_URL,
            'curriculum' => $curriculum,
            'completed_lessons' => $completed_lessons,
            'progress' => [
                'completed' => count($completed_lessons),
                'total' => $total_lessons
            ],
            'downloads' => $resourceModel->getAllDownloads(),
            'links' => $resourceModel->getAllLinks(),
            'announcement_text' => $settingModel->getSetting('announcement_text')
        ]);
    }

    public function student_vdo_otp() {
        $this->verifyToken();
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->respond(['success' => false, 'message' => 'Invalid method'], 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) $input = $_POST;
        $videoId = $input['video_id'] ?? '';
        if (empty($videoId)) {
            $this->respond(['success' => false, 'message' => 'Video ID required'], 400);
        }
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://dev.vdocipher.com/api/videos/{$videoId}/otp");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['ttl' => 300]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Apisecret ' . VDOCIPHER_API_SECRET,
            'Content-Type: application/json',
            'Accept: application/json'
        ]);
        $result = curl_exec($ch);
        curl_close($ch);
        $response = json_decode($result, true);
        if (isset($response['otp']) && isset($response['playbackInfo'])) {
            $this->respond([
                'success' => true,
                'otp' => $response['otp'],
                'playbackInfo' => $response['playbackInfo']
            ]);
        } else {
            $this->respond(['success' => false, 'message' => 'Failed to generate OTP'], 500);
        }
    }
}
