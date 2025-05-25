<?php
// Désactiver l'affichage des erreurs PHP
error_reporting(0);
ini_set('display_errors', 0);

require_once '../config/database.php';
require_once '../config/jwt.php';
require_once '../config/Response.php';

// Configuration CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

// Gérer les requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Récupération et validation des données
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['email']) || !isset($input['password'])) {
        Response::error('Email et mot de passe requis');
    }

    $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
    $password = $input['password'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        Response::error('Format d\'email invalide');
    }

    // Connexion à la base de données
    $database = new Database();
    $db = $database->getConnection();

    // Vérification des identifiants
    $query = "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        Response::unauthorized('Email ou mot de passe incorrect');
    }

    // Génération des tokens
    $jwt = new JwtHandler();
    $tokens = $jwt->generateTokens([
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role']
    ]);

    // Retourner la réponse
    Response::success([
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ],
        'tokens' => $tokens
    ], 'Connexion réussie');

} catch (Exception $e) {
    Response::serverError($e->getMessage());
}
?> 