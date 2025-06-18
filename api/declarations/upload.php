<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Configuration CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-User-ID');
header('Content-Type: application/json');

// Gérer la requête OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

    // Vérifier si un fichier a été uploadé
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Aucun fichier uploadé ou erreur lors de l\'upload');
    }

    $file = $_FILES['image'];

    // Vérifier le type de fichier
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowed_types)) {
        throw new Exception('Type de fichier non autorisé. Formats acceptés : JPG, PNG, GIF');
    }

    // Vérifier la taille du fichier (max 5MB)
    $max_size = 5 * 1024 * 1024; // 5MB en octets
    if ($file['size'] > $max_size) {
        throw new Exception('Le fichier est trop volumineux. Taille maximale : 5MB');
    }

    // Créer le dossier d'upload s'il n'existe pas
    $upload_dir = '../../uploads/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // Générer un nom de fichier unique
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_') . '.' . $extension;
    $filepath = $upload_dir . $filename;

    // Déplacer le fichier
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        throw new Exception('Erreur lors du déplacement du fichier');
    }

    // Connexion à la base de données
    $database = new Database();
    $db = $database->getConnection();

    // Vérifier si l'utilisateur existe
    $stmt = $db->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    if (!$stmt->fetch()) {
        // Supprimer le fichier si l'utilisateur n'existe pas
        unlink($filepath);
        throw new Exception('Utilisateur invalide');
    }

    // Construire l'URL relative pour le stockage en base de données
    $relative_path = 'uploads/' . $filename;

        echo json_encode([
            'success' => true,
            'message' => 'Image uploadée avec succès',
            'filename' => $filename,
        'url' => $relative_path
    ]);

} catch (Exception $e) {
    // Supprimer le fichier en cas d'erreur
    if (isset($filepath) && file_exists($filepath)) {
        unlink($filepath);
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 