<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID manquant']);
    exit;
}

$id = intval($_GET['id']);

try {
    $database = new Database();
    $db = $database->getConnection();

    // Récupérer l'objet_id lié à la déclaration
    $stmt = $db->prepare("SELECT objet_id FROM declarations WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        $objet_id = $row['objet_id'];
        // Supprimer la déclaration
        $stmt = $db->prepare("DELETE FROM declarations WHERE id = ?");
        $stmt->execute([$id]);
        // Supprimer l'objet
        $stmt = $db->prepare("DELETE FROM objets WHERE id = ?");
        $stmt->execute([$objet_id]);
    }
    echo json_encode(['success' => true, 'message' => 'Déclaration supprimée']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}