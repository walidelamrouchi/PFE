<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Configuration CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-User-ID');
header('Content-Type: application/json');

// Gérer la requête OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée'
    ]);
    exit;
}

try {
    // Vérifier l'ID de l'utilisateur
    $user_id = $_SERVER['HTTP_X_USER_ID'] ?? null;
    if (!$user_id) {
        throw new Exception('Utilisateur non authentifié');
    }

    // Connexion à la base de données
    $database = new Database();
    $db = $database->getConnection();

    // Vérifier si l'utilisateur existe
    $stmt = $db->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    if (!$stmt->fetch()) {
        throw new Exception('Utilisateur invalide');
    }

    // Récupérer les déclarations de l'utilisateur
    $query = "SELECT 
        d.id as declaration_id,
        d.type,
        d.location,
        d.date_incident,
        d.contact_email,
        d.created_at as declaration_created_at,
        d.auth_question,
        d.auth_answer,
        o.id as objet_id,
        o.title,
        o.description,
        o.image_url,
        o.category_id,
        o.created_at as objet_created_at,
        c.name as category_name,
        c.description as category_description
    FROM declarations d
    JOIN objets o ON d.objet_id = o.id
    JOIN categories c ON o.category_id = c.id
    WHERE d.user_id = ?
    ORDER BY d.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute([$user_id]);
    $declarations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $declarations
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 