<?php
class ModuleModel extends Model {
    
    // Modules
    public function getAllModules() {
        $stmt = $this->db->query("SELECT * FROM modules ORDER BY sort_order ASC, created_at ASC");
        return $stmt->fetchAll();
    }

    public function getModuleById($id) {
        $stmt = $this->db->prepare("SELECT * FROM modules WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function createModule($title, $description, $sort_order = 0) {
        $stmt = $this->db->prepare("INSERT INTO modules (title, description, sort_order) VALUES (:title, :description, :sort_order)");
        return $stmt->execute([
            'title' => $title,
            'description' => $description,
            'sort_order' => $sort_order
        ]);
    }

    public function updateModule($id, $title, $description, $sort_order = 0) {
        $stmt = $this->db->prepare("UPDATE modules SET title = :title, description = :description, sort_order = :sort_order WHERE id = :id");
        return $stmt->execute([
            'id' => $id,
            'title' => $title,
            'description' => $description,
            'sort_order' => $sort_order
        ]);
    }

    public function deleteModule($id) {
        $stmt = $this->db->prepare("DELETE FROM modules WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    // Lessons
    public function getLessonsByModuleId($module_id) {
        $stmt = $this->db->prepare("SELECT * FROM lessons WHERE module_id = :module_id ORDER BY sort_order ASC, created_at ASC");
        $stmt->execute(['module_id' => $module_id]);
        return $stmt->fetchAll();
    }

    public function getLessonById($id) {
        $stmt = $this->db->prepare("SELECT * FROM lessons WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function createLesson($module_id, $title, $description, $bunny_video_id, $duration, $sort_order = 0, $is_preview = false, $attachment_path = null, $offline_zip_url = null) {
        $stmt = $this->db->prepare("INSERT INTO lessons (module_id, title, description, bunny_video_id, duration, sort_order, is_preview, attachment_path, offline_zip_url) VALUES (:module_id, :title, :description, :bunny_video_id, :duration, :sort_order, :is_preview, :attachment_path, :offline_zip_url)");
        return $stmt->execute([
            'module_id' => $module_id,
            'title' => $title,
            'description' => $description,
            'bunny_video_id' => $bunny_video_id,
            'duration' => $duration,
            'sort_order' => $sort_order,
            'is_preview' => $is_preview ? 1 : 0,
            'attachment_path' => $attachment_path,
            'offline_zip_url' => $offline_zip_url
        ]);
    }

    public function updateLesson($id, $title, $description, $bunny_video_id, $duration, $sort_order = 0, $is_preview = false, $offline_zip_url = null) {
        $stmt = $this->db->prepare("UPDATE lessons SET title = :title, description = :description, bunny_video_id = :bunny_video_id, duration = :duration, sort_order = :sort_order, is_preview = :is_preview, offline_zip_url = :offline_zip_url WHERE id = :id");
        return $stmt->execute([
            'id' => $id,
            'title' => $title,
            'description' => $description,
            'bunny_video_id' => $bunny_video_id,
            'duration' => $duration,
            'sort_order' => $sort_order,
            'is_preview' => $is_preview ? 1 : 0,
            'offline_zip_url' => $offline_zip_url
        ]);
    }

    public function deleteLesson($id) {
        $stmt = $this->db->prepare("DELETE FROM lessons WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    // Progress
    public function getUserProgress($user_id) {
        $stmt = $this->db->prepare("SELECT lesson_id FROM user_progress WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getTotalLessons() {
        $stmt = $this->db->query("SELECT COUNT(id) as total FROM lessons");
        return $stmt->fetch()['total'] ?? 0;
    }
}
