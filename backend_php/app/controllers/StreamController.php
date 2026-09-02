<?php
class StreamController extends Controller {

    public function __construct() {
        // Prevent CORS issues
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }
    }

    public function video() {
        $path = $_GET['path'] ?? '';
        
        if (empty($path)) {
            http_response_code(400);
            die("No path provided");
        }

        // Security check to prevent directory traversal
        if (strpos($path, '..') !== false) {
            http_response_code(403);
            die("Invalid path");
        }

        $file = __DIR__ . '/../../' . $path;
        
        if (!file_exists($file)) {
            http_response_code(404);
            die("Video not found");
        }

        $size = filesize($file);
        $time = date('r', filemtime($file));

        $fm = @fopen($file, 'rb');
        if (!$fm) {
            http_response_code(500);
            die("Could not open file");
        }

        $begin = 0;
        $end = $size - 1;

        if (isset($_SERVER['HTTP_RANGE'])) {
            if (preg_match('/bytes=\h*(\d+)-(\d*)[\D.*]?/i', $_SERVER['HTTP_RANGE'], $matches)) {
                $begin = intval($matches[1]);
                if (!empty($matches[2])) {
                    $end = intval($matches[2]);
                }
            }
        }

        if (isset($_SERVER['HTTP_RANGE'])) {
            header('HTTP/1.1 206 Partial Content');
        } else {
            header('HTTP/1.1 200 OK');
        }

        header("Content-Type: video/mp4");
        header('Cache-Control: public, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Accept-Ranges: bytes');
        header('Content-Length:' . (($end - $begin) + 1));
        if (isset($_SERVER['HTTP_RANGE'])) {
            header("Content-Range: bytes $begin-$end/$size");
        }
        header("Content-Disposition: inline; filename=".basename($file));
        header("Content-Transfer-Encoding: binary");
        header("Last-Modified: $time");

        $cur = $begin;
        fseek($fm, $begin, 0);

        while(!feof($fm) && $cur <= $end && (connection_status() == 0)) {
            print fread($fm, min(1024 * 16, ($end - $cur) + 1));
            $cur += 1024 * 16;
        }
        
        fclose($fm);
    }
}
