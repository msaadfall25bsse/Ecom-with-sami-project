<?php
class Controller {
    public function model($model) {
        require_once '../app/models/' . $model . '.php';
        return new $model();
    }

    public function view($view, $data = []) {
        if(file_exists('../app/views/' . $view . '.php')) {
            require_once '../app/views/' . $view . '.php';
        } else {
            die("View does not exist: " . $view);
        }
    }
    
    public function render($view, $data = [], $layout = 'public/main') {
        extract($data);
        if(file_exists('../app/views/layouts/' . $layout . '.php')) {
            require_once '../app/views/layouts/' . $layout . '.php';
        } else {
            die("Layout does not exist");
        }
    }

    public function redirect($url) {
        header("Location: " . BASE_URL . $url);
        exit();
    }
}
