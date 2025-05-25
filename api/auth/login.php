<?php
// Désactiver l'affichage des erreurs PHP
error_reporting(0);
ini_set('display_errors', 0);

// En-têtes CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Max-Age: 3600");

// Gérer les requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

try {
    require_once '../config/database.php';
    
    // Créer une instance de Database et obtenir la connexion
    $database = new Database();
    $db = $database->getConnection();

    // Vérifier la méthode
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Méthode non autorisée', 405);
    }

    // Récupérer et décoder les données JSON
    $input = file_get_contents("php://input");
    if (!$input) {
        throw new Exception('Aucune donnée reçue', 400);
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Données JSON invalides', 400);
    }
    // Vérifier les données
    if (empty($data['email']) || empty($data['password'])) {
        throw new Exception('Email et mot de passe requis', 400);
    }
    $email = htmlspecialchars(strip_tags($data['email']));
    $password = $data['password'];

    // Vérifier les identifiants
    $query = "SELECT * FROM users WHERE email = ? LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        throw new Exception('Email ou mot de passe incorrect', 401);
    }

    // Authentification réussie
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_role'] = $user['role'];

    // Retourner la réponse
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Erreur lors de la connexion',
        'error' => 'Erreur de base de données: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'message' => $e->getMessage()
    ]);
}
?> 