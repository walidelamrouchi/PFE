<?php
// Désactiver l'affichage des erreurs PHP
error_reporting(0);
ini_set('display_errors', 0);

// En-têtes CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Gérer les requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        throw new Exception('Données incomplètes', 400);
    }

    $name = htmlspecialchars(strip_tags($data['name']));
    $email = htmlspecialchars(strip_tags($data['email']));
    $password = $data['password'];

    // Vérifier si l'email existe déjà
    $checkQuery = "SELECT id FROM users WHERE email = ?";
    $stmt = $db->prepare($checkQuery);
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        throw new Exception('Cet email est déjà utilisé', 400);
    }

    // Hasher le mot de passe
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Insérer l'utilisateur
    $insertQuery = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";
    $stmt = $db->prepare($insertQuery);
    $stmt->execute([$name, $email, $password_hash]);
    
    $user_id = $db->lastInsertId();

    // Retourner la réponse
    http_response_code(201);
    echo json_encode([
        "message" => "Inscription réussie",
        "user" => [
            "id" => $user_id,
            "name" => $name,
            "email" => $email
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Erreur lors de l'inscription",
        "error" => "Erreur de base de données: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        "message" => $e->getMessage()
    ]);
}
?>
