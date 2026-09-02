<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/core/Database.php';

$payload = "1|test@test.com";
$signature = hash_hmac('sha256', $payload, DB_PASS);
$token = base64_encode($payload . '|' . $signature);

$ch = curl_init('https://ecomwithsami.com/api/modules');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token"
]);
$res = curl_exec($ch);
echo "RESPONSE FROM LIVE API WITH TOKEN:\n";
echo $res;
