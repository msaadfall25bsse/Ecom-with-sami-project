<?php
class Controller {
    public function model($model) {
        $path = dirname(__DIR__) . '/app/models/' . $model . '.php';
        if (file_exists($path)) {
            require_once $path;
            return new $model();
        }
        die("Model does not exist: " . $model);
    }

    public function view($view, $data = []) {
        $path = dirname(__DIR__) . '/app/views/' . $view . '.php';
        if (file_exists($path)) {
            require_once $path;
        } else {
            die("View does not exist: " . $view);
        }
    }
    
    public function render($view, $data = [], $layout = 'public/main') {
        extract($data);
        $path = dirname(__DIR__) . '/app/views/layouts/' . $layout . '.php';
        if (file_exists($path)) {
            require_once $path;
        } else {
            die("Layout does not exist: " . $layout);
        }
    }

    public function redirect($url) {
        header("Location: " . BASE_URL . $url);
        exit();
    }
}
