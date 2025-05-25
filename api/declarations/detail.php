<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once '../config/database.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'ID manquant'
    ]);
    exit;
}

$id = intval($_GET['id']);

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT d.id as declaration_id, d.type, d.location, d.date_incident, d.contact_email, d.created_at as declaration_created_at,
                     d.returned,
                     o.id as objet_id, o.title, o.description, o.image_url, o.category_id, o.created_at as objet_created_at,
                     c.name as category_name, c.description as category_description
              FROM declarations d
              JOIN objets o ON d.objet_id = o.id
              JOIN categories c ON o.category_id = c.id
              WHERE d.id = ?
              LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->execute([$id]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$item) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Déclaration non trouvée'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'data' => $item
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 