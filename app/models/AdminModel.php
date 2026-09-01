<?php
class AdminModel extends Model {
    public function login($username, $password) {
        $stmt = $this->db->prepare("SELECT * FROM admins WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $admin = $stmt->fetch();

        if($admin && password_verify($password, $admin['password'])) {
            return $admin;
        }
        return false;
    }
}
