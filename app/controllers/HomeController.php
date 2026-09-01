<?php
class HomeController extends Controller {
    public function index() {
        $testimonialModel = $this->model('TestimonialModel');
        $settingModel = $this->model('SettingModel');
        
        $data = [
            'title' => 'Ecom With Sami - Premium Ecommerce Course',
            'reviews' => $testimonialModel->getReviews(),
            'videos' => $testimonialModel->getVideos(),
            'proofs' => $testimonialModel->getProofs(),
            'settings' => $settingModel->getAllSettings()
        ];
        
        $this->render('public/home', $data);
    }

    public function checkout() {
        $settingModel = $this->model('SettingModel');
        $this->render('public/checkout', [
            'title' => 'Checkout - Ecom With Sami',
            'settings' => $settingModel->getAllSettings()
        ]);
    }

    public function processCheckout() {
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = [
                'first_name' => $_POST['first_name'] ?? '',
                'last_name' => $_POST['last_name'] ?? '',
                'email' => $_POST['email'] ?? '',
                'phone' => $_POST['phone'] ?? '',
                'city' => $_POST['city'] ?? '',
                'payment_method' => $_POST['payment_method'] ?? '',
                'screenshot_path' => ''
            ];

            // Handle file upload
            if(isset($_FILES['screenshot']) && $_FILES['screenshot']['error'] == 0) {
                $uploadDir = __DIR__ . '/../../public/uploads/receipts/';
                if(!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
                
                $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['screenshot']['name']));
                $targetFile = $uploadDir . $fileName;
                
                if(move_uploaded_file($_FILES['screenshot']['tmp_name'], $targetFile)) {
                    $data['screenshot_path'] = 'public/uploads/receipts/' . $fileName;
                }
            }

            $orderModel = $this->model('OrderModel');
            $orderModel->createOrder($data);

            $this->redirect('/home/success');
        }
    }

    public function success() {
        $this->render('public/success', ['title' => 'Order Successful']);
    }

    public function apps() {
        $settingModel = $this->model('SettingModel');
        $this->render('public/apps', [
            'title' => 'Download App - Ecom With Sami',
            'settings' => $settingModel->getAllSettings()
        ]);
    }
}
