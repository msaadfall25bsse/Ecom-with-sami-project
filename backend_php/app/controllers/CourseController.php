<?php
class CourseController extends Controller {

    public function __construct() {
        // Here we would typically check if the user is logged in as a student and has purchased the course.
        if(!isset($_SESSION['student_logged_in'])) { 
            $this->redirect('/auth/login'); 
        }
    }

    public function markComplete($lesson_id) {
        if(!isset($_SESSION['student_logged_in'])) { $this->redirect('/auth/login'); }
        $user_id = $_SESSION['user_id'] ?? 0;
        if ($user_id) {
            $db = Database::getInstance()->getConnection();
            $stmt = $db->prepare("INSERT IGNORE INTO user_progress (user_id, lesson_id) VALUES (:uid, :lid)");
            $stmt->execute(['uid' => $user_id, 'lid' => $lesson_id]);
        }
        $this->redirect('/course/index/' . $lesson_id);
    }

    public function index($lesson_id = null) {
        $moduleModel = $this->model('ModuleModel');
        
        $modules = $moduleModel->getAllModules();
        $user_id = $_SESSION['user_id'] ?? 0;
        $completed_lessons = $user_id ? $moduleModel->getUserProgress($user_id) : [];
        $curriculum = [];
        $current_lesson = null;
        $first_lesson = null;

        // Group lessons by module
        foreach ($modules as $module) {
            $lessons = $moduleModel->getLessonsByModuleId($module['id']);
            $curriculum[] = [
                'module' => $module,
                'lessons' => $lessons
            ];

            if (!$first_lesson && count($lessons) > 0) {
                $first_lesson = $lessons[0];
            }

            if ($lesson_id) {
                foreach ($lessons as $lesson) {
                    if ($lesson['id'] == $lesson_id) {
                        $current_lesson = $lesson;
                        break;
                    }
                }
            }
        }

        // Default to first lesson if none selected
        if (!$current_lesson && $first_lesson) {
            $current_lesson = $first_lesson;
        }

        // Determine video type (Bunny Stream, VdoCipher, or Local)
        $is_bunny = false;
        $is_vdocipher = false;
        $is_local = false;
        $vdo_otp = '';
        $vdo_playbackInfo = '';

        if ($current_lesson && !empty($current_lesson['bunny_video_id'])) {
            $videoId = $current_lesson['bunny_video_id'];
            
            if (strpos($videoId, 'public/uploads/videos/') !== false) {
                // It's a local video upload
                $is_local = true;
            } elseif (strpos($videoId, '-') !== false) {
                // It's an old Bunny Stream UUID
                $is_bunny = true;
            } else {
                // It's a VdoCipher ID
                $is_vdocipher = true;
                
                // Generate VdoCipher OTP
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
                if(isset($response['otp']) && isset($response['playbackInfo'])) {
                    $vdo_otp = $response['otp'];
                    $vdo_playbackInfo = $response['playbackInfo'];
                }
            }
        }

        $resourceModel = $this->model('ResourceModel');
        $settingModel = $this->model('SettingModel');
        $downloads = $resourceModel->getAllDownloads();
        $links = $resourceModel->getAllLinks();
        $announcement_text = $settingModel->getSetting('announcement_text');

        $this->render('student/course', [
            'title' => 'My Course Dashboard',
            'curriculum' => $curriculum,
            'current_lesson' => $current_lesson,
            'completed_lessons' => $completed_lessons,
            'downloads' => $downloads,
            'links' => $links,
            'announcement_text' => $announcement_text,
            'is_bunny' => $is_bunny,
            'is_vdocipher' => $is_vdocipher,
            'is_local' => $is_local,
            'vdo_otp' => $vdo_otp,
            'vdo_playbackInfo' => $vdo_playbackInfo
        ]);
    }
}
