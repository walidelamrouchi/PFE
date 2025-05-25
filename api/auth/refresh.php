<?php
require_once '../config/database.php';
require_once '../config/jwt.php';
require_once '../config/Response.php';

// Configuration CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Méthode non autorisée', 405);
}

try {
    // Récupération du token de rafraîchissement
    $headers = getallheaders();
    $refresh_token = null;

    if (isset($headers['Authorization'])) {
        $auth_header = $headers['Authorization'];
        if (preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
            $refresh_token = $matches[1];
        }
    }

    if (!$refresh_token) {
        Response::unauthorized('Token de rafraîchissement manquant');
    }

    // Rafraîchissement du token
    $jwt = new JwtHandler();
    $tokens = $jwt->refreshAccessToken($refresh_token);

    if (!$tokens) {
        Response::unauthorized('Token de rafraîchissement invalide ou expiré');
    }

    Response::success([
        'tokens' => $tokens
    ], 'Token rafraîchi avec succès');

} catch (Exception $e) {
    Response::serverError($e->getMessage());
} 