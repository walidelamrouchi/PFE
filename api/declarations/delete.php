<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-User-ID');
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

    // Vérifier l'authentification
    $user_id = $_SERVER['HTTP_X_USER_ID'] ?? null;
    if (!$user_id) {
        throw new Exception('Utilisateur non authentifié');
    }

    // Vérifier que la déclaration appartient à l'utilisateur
    $stmt = $db->prepare("SELECT objet_id FROM declarations WHERE id = ? AND user_id = ?");
    $stmt->execute([$id, $user_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$row) {
        throw new Exception('Déclaration non trouvée ou accès non autorisé');
    }

    $objet_id = $row['objet_id'];
    // Supprimer la déclaration
    $stmt = $db->prepare("DELETE FROM declarations WHERE id = ? AND user_id = ?");
    $stmt->execute([$id, $user_id]);
    // Supprimer l'objet
    $stmt = $db->prepare("DELETE FROM objets WHERE id = ?");
    $stmt->execute([$objet_id]);
    echo json_encode(['success' => true, 'message' => 'Déclaration supprimée']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}