<?php
class AdminController extends Controller {
    private $adminModel;

    public function __construct() {
        $this->adminModel = $this->model('AdminModel');
    }

    public function index() {
        if(isset($_SESSION['admin_logged_in'])) {
            $this->redirect('/admin/dashboard');
        }
        $this->render('admin/login', ['title' => 'Admin Login'], 'admin/auth');
    }

    public function login() {
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $username = $_POST['username'] ?? '';
            $password = $_POST['password'] ?? '';

            $admin = $this->adminModel->login($username, $password);

            if($admin) {
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_id'] = $admin['id'];
                $_SESSION['admin_username'] = $admin['username'];
                $this->redirect('/admin/dashboard');
            } else {
                $data = ['title' => 'Admin Login', 'error' => 'Invalid username or password'];
                $this->render('admin/login', $data, 'admin/auth');
            }
        } else {
            $this->redirect('/admin');
        }
    }

    public function logout() {
        unset($_SESSION['admin_logged_in']);
        unset($_SESSION['admin_id']);
        unset($_SESSION['admin_username']);
        $this->redirect('/admin');
    }

    public function dashboard() {
        if(!isset($_SESSION['admin_logged_in'])) {
            $this->redirect('/admin');
        }
        $orderModel = $this->model('OrderModel');
        $metrics = $orderModel->getDashboardMetrics();
        $recentOrders = array_slice($orderModel->getAllOrders(), 0, 10);
        
        $this->render('admin/dashboard', [
            'title' => 'Admin Dashboard',
            'metrics' => $metrics,
            'recentOrders' => $recentOrders
        ], 'admin/main');
    }

    public function orders() {
        if(!isset($_SESSION['admin_logged_in'])) {
            $this->redirect('/admin');
        }
        $orderModel = $this->model('OrderModel');
        $orders = $orderModel->getAllOrders();
        
        $this->render('admin/orders', [
            'title' => 'Manage Orders',
            'orders' => $orders
        ], 'admin/main');
    }

    public function updateOrderStatus() {
        if(!isset($_SESSION['admin_logged_in'])) {
            $this->redirect('/admin');
        }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $orderId = $_POST['order_id'];
            $status = $_POST['status'];
            $studentPassword = $_POST['student_password'] ?? '12345678';
            
            $orderModel = $this->model('OrderModel');
            $orderModel->updateOrderStatus($orderId, $status);

            // Auto-create student account and send email if approved
            if($status == 'approved') {
                $order = $orderModel->getOrderById($orderId);
                if($order) {
                    $userModel = $this->model('UserModel');
                    $name = $order['first_name'] . ' ' . $order['last_name'];
                    
                    $isNewUser = false;
                    // Check if user already exists
                    if(!$userModel->getUserByEmail($order['email'])) {
                        $userModel->createUser($name, $order['email'], $studentPassword, 'student');
                        $isNewUser = true;
                    }
                    
                    // --- Send Email via native PHP mail() ---
                    $to = $order['email'];
                    $subject = 'Your Course Access Details - Ecom With Sami';
                    
                    // Use the custom email body provided by the admin, or fallback if empty
                    $customEmailBody = $_POST['email_body'] ?? '';
                    if (empty(trim($customEmailBody))) {
                        if ($isNewUser) {
                            $customEmailBody = nl2br("Hello {$name},\n\nYour payment has been successfully approved! You can now access your course dashboard.\n\nYour Login Details:\nEmail: {$order['email']}\nPassword: {$studentPassword}\n\nYou can login by downloading our Windows/Android app or via our website.\n\nBest Regards,\nSami");
                        } else {
                            $customEmailBody = nl2br("Hello {$name},\n\nYour recent payment has been successfully approved. Since you already have an account with us, you can log in using your existing email and password.\n\nEmail: {$order['email']}\n\nYou can login by downloading our Windows/Android app or via our website.\n\nBest Regards,\nSami");
                        }
                    }
                    
                    // Since admin might type newlines, we preserve them
                    // Using a domain email for 'From' to prevent Hostinger from dropping the email due to DMARC/SPF policies
                    $domain = $_SERVER['HTTP_HOST'] ?? 'ecomwithsami.com';
                    $domain = str_replace('www.', '', $domain);
                    $fromEmail = "no-reply@" . $domain;

                    $headers = "From: " . SMTP_FROM_NAME . " <" . $fromEmail . ">" . "\r\n";
                    $headers .= "Reply-To: " . SMTP_FROM_EMAIL . "\r\n";
                    $headers .= "MIME-Version: 1.0\r\n";
                    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
                    $headers .= "X-Mailer: PHP/" . phpversion();

                    if (!mail($to, $subject, $customEmailBody, $headers)) {
                        // Show error directly to the admin so they know why it failed
                        die("<h1>Email Failed to Send</h1><p>The student account was created, but the email could not be sent using the native mail() function. Please check your server's email configuration.</p><a href='".BASE_URL."/admin/orders'>Go back to Orders</a>");
                    }
                }
            }
        }
        $this->redirect('/admin/orders');
    }

    // === LMS MODULES MANAGEMENT ===

    public function modules() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $moduleModel = $this->model('ModuleModel');
        $modules = $moduleModel->getAllModules();
        $this->render('admin/modules', ['title' => 'Manage Course Modules', 'modules' => $modules], 'admin/main');
    }

    public function createModule() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $moduleModel = $this->model('ModuleModel');
            $moduleModel->createModule($_POST['title'], $_POST['description'], $_POST['sort_order']);
        }
        $this->redirect('/admin/modules');
    }

    public function updateModule() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $moduleModel = $this->model('ModuleModel');
            $moduleModel->updateModule($_POST['module_id'], $_POST['title'], $_POST['description'], $_POST['sort_order']);
        }
        $this->redirect('/admin/modules');
    }

    public function deleteModule($id) {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $moduleModel = $this->model('ModuleModel');
        $moduleModel->deleteModule($id);
        $this->redirect('/admin/modules');
    }

    // === LMS LESSONS MANAGEMENT ===

    public function lessons($module_id = null) {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $moduleModel = $this->model('ModuleModel');
        
        $modules = $moduleModel->getAllModules();
        $lessons = [];
        $selected_module = null;

        if($module_id) {
            $lessons = $moduleModel->getLessonsByModuleId($module_id);
            $selected_module = $moduleModel->getModuleById($module_id);
        } elseif(count($modules) > 0) {
            $module_id = $modules[0]['id'];
            $lessons = $moduleModel->getLessonsByModuleId($module_id);
            $selected_module = $modules[0];
        }

        $this->render('admin/lessons', [
            'title' => 'Manage Lessons', 
            'modules' => $modules, 
            'lessons' => $lessons,
            'selected_module' => $selected_module
        ], 'admin/main');
    }

    public function createLesson() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Check for post_max_size limits
            if (empty($_POST) && $_SERVER['CONTENT_LENGTH'] > 0) {
                die("<h1>Upload Error!</h1><p>The video is too large. It exceeds your server's <b>post_max_size</b> limit. Please go to Hostinger PHP Settings and increase post_max_size and upload_max_filesize to 1024M.</p><a href='".BASE_URL."/admin/modules'>Go back</a>");
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

            // Handle pre-uploaded chunked video
            if (empty($vdo_video_id) && !empty($uploaded_video_path)) {
                $vdo_video_id = $uploaded_video_path;
            }

            // Handle Local Video Upload ONLY IF ID was not pasted and not chunked
            if(empty($vdo_video_id) && isset($_FILES['video_file']) && $_FILES['video_file']['error'] != UPLOAD_ERR_NO_FILE) {
                if($_FILES['video_file']['error'] == UPLOAD_ERR_INI_SIZE) {
                     die("<h1>Upload Error!</h1><p>The video exceeds your server's <b>upload_max_filesize</b> limit. Please go to Hostinger PHP Settings and increase it to 1024M.</p><a href='".BASE_URL."/admin/modules'>Go back</a>");
                }
                
                if($_FILES['video_file']['error'] == UPLOAD_ERR_OK) {
                    $uploadDir = __DIR__ . '/../../public/uploads/videos/';
                    if(!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }
                    
                    // Generate unique filename to avoid overwrites
                    $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['video_file']['name']));
                    $targetFile = $uploadDir . $fileName;
                    
                    if(move_uploaded_file($_FILES['video_file']['tmp_name'], $targetFile)) {
                        $vdo_video_id = 'public/uploads/videos/' . $fileName;
                    }
                }
            }

            if (empty($vdo_video_id)) {
                die("<h1>Validation Error</h1><p>Please either paste a Video ID or select a file to upload.</p><a href='".BASE_URL."/admin/modules'>Go back</a>");
            }
            
            // Handle Attachment Upload
            $attachment_path = null;
            if(isset($_FILES['attachment_file']) && $_FILES['attachment_file']['error'] == UPLOAD_ERR_OK) {
                $attachDir = __DIR__ . '/../../public/uploads/attachments/';
                if(!is_dir($attachDir)) {
                    mkdir($attachDir, 0777, true);
                }
                $attachName = time() . '_' . preg_replace("/[^a-zA-Z0-9.-]/", "", basename($_FILES['attachment_file']['name']));
                $attachTarget = $attachDir . $attachName;
                if(move_uploaded_file($_FILES['attachment_file']['tmp_name'], $attachTarget)) {
                    $attachment_path = 'public/uploads/attachments/' . $attachName;
                }
            }

            // Handle Offline ZIP Upload (Phase 4)
            $offline_zip_url = null;
            if(isset($_FILES['offline_zip_file']) && $_FILES['offline_zip_file']['error'] == UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../public/uploads/zips/';
                if(!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                
                $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['offline_zip_file']['name']));
                $targetFile = $uploadDir . $fileName;
                
                if(move_uploaded_file($_FILES['offline_zip_file']['tmp_name'], $targetFile)) {
                    $offline_zip_url = 'public/uploads/zips/' . $fileName;
                }
            }

            try {
                if($module_id) {
                    $moduleModel->createLesson($module_id, $title, $description, $vdo_video_id, $duration, $sort_order, $is_preview, $attachment_path, $offline_zip_url);
                    $this->redirect('/admin/lessons/' . $module_id);
                } else {
                    http_response_code(400);
                    die("Error: Module ID is missing.");
                }
            } catch (Exception $e) {
                http_response_code(500);
                die("Database Error: " . $e->getMessage());
            }
        }
    }

    public function uploadChunk() {
        if(!isset($_SESSION['admin_logged_in'])) { 
            http_response_code(403);
            die(json_encode(['error' => 'Unauthorized'])); 
        }

        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $fileName = $_POST['fileName'] ?? '';
            $chunkIndex = $_POST['chunkIndex'] ?? 0;
            
            if(empty($fileName) || !isset($_FILES['file'])) {
                http_response_code(400);
                die(json_encode(['error' => 'Invalid request']));
            }

            $uploadDir = __DIR__ . '/../../public/uploads/videos/';
            if(!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            // Clean the filename (JS should send something like 1612312312_filename.mp4)
            $safeFileName = preg_replace("/[^a-zA-Z0-9._-]/", "", basename($fileName));
            $targetFile = $uploadDir . $safeFileName;

            // Append chunk
            $in = fopen($_FILES['file']['tmp_name'], "rb");
            $out = fopen($targetFile, $chunkIndex == 0 ? "wb" : "ab");

            if ($in && $out) {
                while ($buff = fread($in, 4096)) {
                    fwrite($out, $buff);
                }
            } else {
                http_response_code(500);
                die(json_encode(['error' => 'Failed to open output stream']));
            }

            fclose($in);
            fclose($out);

            die(json_encode(['success' => true, 'chunkIndex' => $chunkIndex, 'path' => 'public/uploads/videos/' . $safeFileName]));
        }
    }

    public function updateLesson() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $id = $_POST['lesson_id'];
            $title = $_POST['title'];
            $description = $_POST['description'];
            $bunny_video_id = $_POST['bunny_video_id'];
            $duration = $_POST['duration'];
            $sort_order = $_POST['sort_order'];
            $is_preview = isset($_POST['is_preview']) ? true : false;
            
            $moduleModel = $this->model('ModuleModel');
            $lesson = $moduleModel->getLessonById($id);
            if($lesson) {
                // Check if new offline zip uploaded
                $offline_zip_url = $lesson['offline_zip_url'];
                if(isset($_FILES['offline_zip_file']) && $_FILES['offline_zip_file']['error'] == UPLOAD_ERR_OK) {
                    $uploadDir = __DIR__ . '/../../public/uploads/zips/';
                    if(!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                    
                    $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['offline_zip_file']['name']));
                    $targetFile = $uploadDir . $fileName;
                    
                    if(move_uploaded_file($_FILES['offline_zip_file']['tmp_name'], $targetFile)) {
                        $offline_zip_url = 'public/uploads/zips/' . $fileName;
                    }
                }
                
                $moduleModel->updateLesson($id, $title, $description, $bunny_video_id, $duration, $sort_order, $is_preview, $offline_zip_url);
                $this->redirect('/admin/lessons/' . $lesson['module_id']);
            } else {
                $this->redirect('/admin/lessons');
            }
        }
    }

    public function deleteLesson($id) {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $moduleModel = $this->model('ModuleModel');
        $lesson = $moduleModel->getLessonById($id);
        if($lesson) {
            $moduleModel->deleteLesson($id);
            $this->redirect('/admin/lessons/' . $lesson['module_id']);
        } else {
            $this->redirect('/admin/lessons');
        }
    }

    // === PIXEL TRACKING ===
    public function pixels() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $settingModel = $this->model('SettingModel');
        $settings = $settingModel->getAllSettings();
        $this->render('admin/pixels', ['title' => 'Pixel Settings', 'settings' => $settings], 'admin/main');
    }

    public function updatePixels() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $settingModel = $this->model('SettingModel');
            
            $keys = ['tracking_head', 'tracking_body'];
            foreach($keys as $key) {
                if(isset($_POST[$key])) {
                    $settingModel->updateSetting($key, $_POST[$key]);
                }
            }
            $this->redirect('/admin/pixels');
        }
    }

    // === SETTINGS MANAGEMENT ===
    public function settings() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $settingModel = $this->model('SettingModel');
        $settings = $settingModel->getAllSettings();
        $this->render('admin/settings', ['title' => 'Website Settings', 'settings' => $settings], 'admin/main');
    }

    public function updateSettings() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $settingModel = $this->model('SettingModel');
            
            $keys = ['android_version', 'windows_version', 'android_update_url', 'windows_update_url', 'course_price', 'course_original_price', 'hero_video_type', 'hero_video_url', 'announcement_text', 'popup_text', 'bank_meezan', 'bank_easypaisa', 'bank_jazzcash', 'bank_meezan_title', 'bank_easypaisa_title', 'bank_jazzcash_title', 'home_hero_title', 'home_hero_subtitle', 'home_hero_desc', 'home_why_dropshipping_title', 'home_what_you_get_title', 'home_instructor_title', 'home_instructor_subtitle', 'home_instructor_desc', 'home_guarantee_title', 'home_guarantee_text', 'home_who_is_for_title', 'home_options_title', 'home_cost_waiting_title', 'home_final_cta_title', 'home_final_cta_subtitle'];
            foreach($keys as $key) {
                if(isset($_POST[$key])) {
                    $settingModel->updateSetting($key, $_POST[$key]);
                }
            }
            
            // Handle Local Video Upload for Hero Section
            if(isset($_POST['hero_video_type']) && $_POST['hero_video_type'] == 'local' && isset($_FILES['local_hero_video']) && $_FILES['local_hero_video']['error'] == UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../public/uploads/videos/';
                if(!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
                $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['local_hero_video']['name']));
                $targetFile = $uploadDir . $fileName;
                if(move_uploaded_file($_FILES['local_hero_video']['tmp_name'], $targetFile)) {
                    $settingModel->updateSetting('hero_video_url', 'public/uploads/videos/' . $fileName);
                }
            }

            $this->redirect('/admin/settings');
        }
    }

    // === TESTIMONIALS MANAGEMENT ===
    public function testimonials() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $testimonialModel = $this->model('TestimonialModel');
        
        $reviews = $testimonialModel->getReviews();
        $videos = $testimonialModel->getVideos();
        $proofs = $testimonialModel->getProofs();
        
        $this->render('admin/testimonials', [
            'title' => 'Manage Social Proof',
            'reviews' => $reviews,
            'videos' => $videos,
            'proofs' => $proofs
        ], 'admin/main');
    }

    public function addReview() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $testimonialModel = $this->model('TestimonialModel');
            $name = $_POST['student_name'];
            $rating = $_POST['rating'] ?? 5;
            $text = $_POST['review_text'];
            $imagePath = null;
            
            if(isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] == UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../public/uploads/images/';
                if(!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                $fileName = time() . '_' . basename($_FILES['profile_image']['name']);
                if(move_uploaded_file($_FILES['profile_image']['tmp_name'], $uploadDir . $fileName)) {
                    $imagePath = 'public/uploads/images/' . $fileName;
                }
            }
            $testimonialModel->addReview($name, $rating, $text, $imagePath);
            $this->redirect('/admin/testimonials');
        }
    }

    public function deleteReview($id) {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $testimonialModel = $this->model('TestimonialModel');
        $testimonialModel->deleteReview($id);
        $this->redirect('/admin/testimonials');
    }

    public function addVideoTestimonial() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $testimonialModel = $this->model('TestimonialModel');
            $url = $_POST['video_url'];
            $testimonialModel->addVideo($url);
            $this->redirect('/admin/testimonials');
        }
    }

    public function deleteVideoTestimonial($id) {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $testimonialModel = $this->model('TestimonialModel');
        $testimonialModel->deleteVideo($id);
        $this->redirect('/admin/testimonials');
    }

    public function addEarningProof() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            if(isset($_FILES['proof_image']) && $_FILES['proof_image']['error'] == UPLOAD_ERR_OK) {
                $testimonialModel = $this->model('TestimonialModel');
                $uploadDir = __DIR__ . '/../../public/uploads/images/';
                if(!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                $fileName = time() . '_' . basename($_FILES['proof_image']['name']);
                if(move_uploaded_file($_FILES['proof_image']['tmp_name'], $uploadDir . $fileName)) {
                    $testimonialModel->addProof('public/uploads/images/' . $fileName);
                }
            }
            $this->redirect('/admin/testimonials');
        }
    }

    public function deleteEarningProof($id) {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $testimonialModel = $this->model('TestimonialModel');
        $testimonialModel->deleteProof($id);
        $this->redirect('/admin/testimonials');
    }

    // === RESOURCES (DOWNLOADS & LINKS) MANAGEMENT ===
    public function resources() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        
        $resourceModel = $this->model('ResourceModel');
        $settingModel = $this->model('SettingModel');
        
        $downloads = $resourceModel->getAllDownloads();
        $links = $resourceModel->getAllLinks();
        $announcement_text = $settingModel->getSetting('announcement_text');
        
        $this->render('admin/resources', [
            'title' => 'Manage LMS Resources',
            'downloads' => $downloads,
            'links' => $links,
            'announcement_text' => $announcement_text
        ], 'admin/main');
    }

    public function createDownload() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $title = $_POST['title'];
            $description = $_POST['description'];
            $sort_order = $_POST['sort_order'] ?? 0;
            
            $file_path = '';
            if(isset($_FILES['file']) && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../public/uploads/resources/';
                if(!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
                
                $fileName = time() . '_' . basename($_FILES['file']['name']);
                if(move_uploaded_file($_FILES['file']['tmp_name'], $uploadDir . $fileName)) {
                    $file_path = 'public/uploads/resources/' . $fileName;
                }
            }
            
            $resourceModel = $this->model('ResourceModel');
            $resourceModel->createDownload($title, $file_path, $description, $sort_order);
            $this->redirect('/admin/resources');
        }
    }

    public function deleteDownload($id) {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $resourceModel = $this->model('ResourceModel');
        $resourceModel->deleteDownload($id);
        $this->redirect('/admin/resources');
    }

    public function createLink() {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $title = $_POST['title'];
            $url = $_POST['url'];
            $description = $_POST['description'];
            $sort_order = $_POST['sort_order'] ?? 0;
            
            $resourceModel = $this->model('ResourceModel');
            $resourceModel->createLink($title, $url, $description, $sort_order);
            $this->redirect('/admin/resources');
        }
    }

    public function deleteLink($id) {
        if(!isset($_SESSION['admin_logged_in'])) { $this->redirect('/admin'); }
        $resourceModel = $this->model('ResourceModel');
        $resourceModel->deleteLink($id);
        $this->redirect('/admin/resources');
    }
}
