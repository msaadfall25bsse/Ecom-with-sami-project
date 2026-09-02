<?php
class ResourceModel {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // --- Download Center ---
    public function getAllDownloads() {
        $stmt = $this->db->query("SELECT * FROM download_center ORDER BY sort_order ASC, created_at DESC");
        return $stmt->fetchAll();
    }

    public function getDownloadById($id) {
        $stmt = $this->db->prepare("SELECT * FROM download_center WHERE id = :id");
        $stmt->execute(["id" => $id]);
        return $stmt->fetch();
    }

    public function createDownload($title, $file_path, $description, $sort_order = 0) {
        $stmt = $this->db->prepare("INSERT INTO download_center (title, file_path, description, sort_order) VALUES (:title, :file_path, :description, :sort_order)");
        return $stmt->execute([
            "title" => $title,
            "file_path" => $file_path,
            "description" => $description,
            "sort_order" => $sort_order
        ]);
    }

    public function updateDownload($id, $title, $description, $sort_order = 0) {
        $stmt = $this->db->prepare("UPDATE download_center SET title = :title, description = :description, sort_order = :sort_order WHERE id = :id");
        return $stmt->execute([
            "id" => $id,
            "title" => $title,
            "description" => $description,
            "sort_order" => $sort_order
        ]);
    }

    public function updateDownloadFile($id, $file_path) {
        $stmt = $this->db->prepare("UPDATE download_center SET file_path = :file_path WHERE id = :id");
        return $stmt->execute(["id" => $id, "file_path" => $file_path]);
    }

    public function deleteDownload($id) {
        $stmt = $this->db->prepare("DELETE FROM download_center WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }

    // --- Important Links ---
    public function getAllLinks() {
        $stmt = $this->db->query("SELECT * FROM important_links ORDER BY sort_order ASC, created_at DESC");
        return $stmt->fetchAll();
    }

    public function getLinkById($id) {
        $stmt = $this->db->prepare("SELECT * FROM important_links WHERE id = :id");
        $stmt->execute(["id" => $id]);
        return $stmt->fetch();
    }

    public function createLink($title, $url, $description, $sort_order = 0) {
        $stmt = $this->db->prepare("INSERT INTO important_links (title, url, description, sort_order) VALUES (:title, :url, :description, :sort_order)");
        return $stmt->execute([
            "title" => $title,
            "url" => $url,
            "description" => $description,
            "sort_order" => $sort_order
        ]);
    }

    public function updateLink($id, $title, $url, $description, $sort_order = 0) {
        $stmt = $this->db->prepare("UPDATE important_links SET title = :title, url = :url, description = :description, sort_order = :sort_order WHERE id = :id");
        return $stmt->execute([
            "id" => $id,
            "title" => $title,
            "url" => $url,
            "description" => $description,
            "sort_order" => $sort_order
        ]);
    }

    public function deleteLink($id) {
        $stmt = $this->db->prepare("DELETE FROM important_links WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }
}

