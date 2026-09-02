<?php
class OrderModel extends Model {
    public function createOrder($data) {
        $stmt = $this->db->prepare("INSERT INTO orders (first_name, last_name, email, phone, city, payment_method, screenshot_path) VALUES (:first_name, :last_name, :email, :phone, :city, :payment_method, :screenshot_path)");
        return $stmt->execute([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'city' => $data['city'],
            'payment_method' => $data['payment_method'],
            'screenshot_path' => $data['screenshot_path']
        ]);
    }

    public function getAllOrders() {
        $stmt = $this->db->query("SELECT * FROM orders ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function getOrderById($id) {
        $stmt = $this->db->prepare("SELECT * FROM orders WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function updateOrderStatus($id, $status) {
        $stmt = $this->db->prepare("UPDATE orders SET status = :status WHERE id = :id");
        return $stmt->execute(['status' => $status, 'id' => $id]);
    }

    public function getDashboardMetrics() {
        // Total Orders
        $stmt = $this->db->query("SELECT COUNT(*) as count FROM orders");
        $totalOrders = $stmt->fetch()['count'];

        // Total Approved
        $stmt = $this->db->query("SELECT COUNT(*) as count FROM orders WHERE status = 'approved'");
        $totalApproved = $stmt->fetch()['count'];

        // Revenue (Assuming fixed 3900 per approved order)
        $revenue = $totalApproved * 3900;

        // Pending Orders
        $stmt = $this->db->query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
        $pendingOrders = $stmt->fetch()['count'];

        return [
            'total_orders' => $totalOrders,
            'total_approved' => $totalApproved,
            'revenue' => $revenue,
            'pending_orders' => $pendingOrders
        ];
    }
}
