<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID manquant']);
    exit;
}

$id = intval($data['id']);

try {
    $database = new Database();
    $db = $database->getConnection();

    // Ici, on ajoute un champ 'returned' dans la table declarations (à créer si besoin)
    $stmt = $db->prepare("UPDATE declarations SET returned = 1 WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'Objet marqué comme rendu']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

// Assurez-vous que la colonne 'returned' existe dans la table 'declarations' :
// ALTER TABLE declarations ADD COLUMN returned TINYINT(1) DEFAULT 0;
