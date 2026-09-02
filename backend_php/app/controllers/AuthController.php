<?php
class AuthController extends Controller {

    public function login() {
        if(isset($_SESSION['student_logged_in'])) {
            $this->redirect('/course');
        }
        
        $error = null;

        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';

            $userModel = $this->model('UserModel');
            $user = $userModel->login($email, $password);

            if($user && $user['role'] == 'student') {
                $_SESSION['student_logged_in'] = true;
                $_SESSION['student_id'] = $user['id'];
                $_SESSION['student_name'] = $user['name'];
                $this->redirect('/course');
            } else {
                $error = 'Invalid email or password, or access denied.';
            }
        }

        // Render using the public layout or auth layout
        $this->render('public/login', ['title' => 'Student Login', 'error' => $error]);
    }

    public function logout() {
        unset($_SESSION['student_logged_in']);
        unset($_SESSION['student_id']);
        unset($_SESSION['student_name']);
        $this->redirect('/auth/login');
    }
}
