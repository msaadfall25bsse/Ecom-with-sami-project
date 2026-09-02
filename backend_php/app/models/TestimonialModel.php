<?php
class TestimonialModel {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    // --- TEXT REVIEWS ---
    public function getReviews() {
        $stmt = $this->db->query("SELECT * FROM reviews ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function addReview($name, $rating, $text, $imagePath = null) {
        $stmt = $this->db->prepare("INSERT INTO reviews (student_name, rating, review_text, image_path) VALUES (:name, :rating, :text, :image)");
        return $stmt->execute([
            'name' => $name,
            'rating' => $rating,
            'text' => $text,
            'image' => $imagePath
        ]);
    }

    public function deleteReview($id) {
        $stmt = $this->db->prepare("DELETE FROM reviews WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    // --- VIDEO TESTIMONIALS ---
    public function getVideos() {
        $stmt = $this->db->query("SELECT * FROM video_testimonials ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function addVideo($url, $thumbnailPath = null) {
        $stmt = $this->db->prepare("INSERT INTO video_testimonials (video_url, thumbnail_path) VALUES (:url, :thumb)");
        return $stmt->execute([
            'url' => $url,
            'thumb' => $thumbnailPath
        ]);
    }

    public function deleteVideo($id) {
        $stmt = $this->db->prepare("DELETE FROM video_testimonials WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    // --- EARNING PROOFS ---
    public function getProofs() {
        $stmt = $this->db->query("SELECT * FROM earning_proofs ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function addProof($imagePath) {
        $stmt = $this->db->prepare("INSERT INTO earning_proofs (image_path) VALUES (:image)");
        return $stmt->execute(['image' => $imagePath]);
    }

    public function deleteProof($id) {
        $stmt = $this->db->prepare("DELETE FROM earning_proofs WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
