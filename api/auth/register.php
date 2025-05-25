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

// Vérifier si c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Méthode non autorisée', 405);
}

try {
    // Récupération et validation des données
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['password'])) {
        Response::error('Tous les champs sont requis');
    }

    $name = htmlspecialchars(strip_tags($input['name']), ENT_QUOTES, 'UTF-8');
    $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
    $password = $input['password'];

    // Validation des données
    if (strlen($name) < 2) {
        Response::error('Le nom doit contenir au moins 2 caractères');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        Response::error('Format d\'email invalide');
    }

    if (strlen($password) < 8) {
        Response::error('Le mot de passe doit contenir au moins 8 caractères');
    }

    // Connexion à la base de données
    $database = new Database();
    $db = $database->getConnection();

    // Vérifier si l'email existe déjà
    $query = "SELECT id FROM users WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        Response::error('Cet email est déjà utilisé');
    }

    // Hashage du mot de passe
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Insertion de l'utilisateur
    $query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";
    $stmt = $db->prepare($query);
    $stmt->execute([$name, $email, $password_hash]);
    
    $user_id = $db->lastInsertId();

    // Génération des tokens
    $jwt = new JwtHandler();
    $tokens = $jwt->generateTokens([
        'id' => $user_id,
        'email' => $email,
        'role' => 'user'
    ]);

    // Retourner la réponse
    Response::success([
        'user' => [
            'id' => $user_id,
            'name' => $name,
            'email' => $email,
            'role' => 'user'
        ],
        'tokens' => $tokens
    ], 'Inscription réussie');

} catch (Exception $e) {
    Response::serverError($e->getMessage());
}
?>
