<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

parse_str(file_get_contents("php://input"), $_PUT);
$data = json_decode(file_get_contents("php://input"), true);

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
    if (!$row) {
        throw new Exception("Déclaration non trouvée");
    }
    $objet_id = $row['objet_id'];

    // Mettre à jour l'objet
    $stmt = $db->prepare("UPDATE objets SET title = ?, description = ?, category_id = ?, image_url = ? WHERE id = ?");
    $stmt->execute([
        $data['objet']['title'],
        $data['objet']['description'],
        $data['objet']['category_id'],
        $data['objet']['image_url'],
        $objet_id
    ]);

    // Mettre à jour la déclaration
    $stmt = $db->prepare("UPDATE declarations SET type = ?, location = ?, date_incident = ?, contact_email = ?, auth_question = ?, auth_answer = ? WHERE id = ?");
    $stmt->execute([
        $data['type'],
        $data['location'],
        $data['date_incident'],
        $data['contact_email'],
        $data['auth_question'] ?? null,
        $data['auth_answer'] ?? null,
        $id
    ]);

    echo json_encode(['success' => true, 'message' => 'Déclaration mise à jour']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
