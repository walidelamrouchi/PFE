<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(['error' => "Aucune image n'a été envoyée"]);
        exit;
    }

    $file = $_FILES['image'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    $maxSize = 5 * 1024 * 1024; // 5MB

    // Vérifier le type de fichier
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Type de fichier non autorisé']);
        exit;
    }

    // Vérifier la taille
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => "L'image est trop volumineuse (max 5MB)"]);
        exit;
    }

    // Générer un nom de fichier unique
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_') . '.' . $extension;
    $uploadPath = __DIR__ . '/../uploads/' . $filename;

    // Déplacer le fichier
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        echo json_encode([
            'success' => true,
            'message' => 'Image uploadée avec succès',
            'filename' => $filename,
            'url' => '/api/uploads/' . $filename
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => "Erreur lors de l'upload de l'image"]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
} 