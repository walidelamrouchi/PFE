<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Récupérer tous les objets déclarés avec jointure sur objets et catégories
    $query = "SELECT d.id as declaration_id, d.type, d.location, d.date_incident, d.contact_email, d.created_at as declaration_created_at,
                     d.returned,
                     o.id as objet_id, o.title, o.description, o.image_url, o.category_id, o.created_at as objet_created_at,
                     c.name as category_name, c.description as category_description
              FROM declarations d
              JOIN objets o ON d.objet_id = o.id
              JOIN categories c ON o.category_id = c.id
              ORDER BY d.created_at DESC";
    $stmt = $db->query($query);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $items
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 