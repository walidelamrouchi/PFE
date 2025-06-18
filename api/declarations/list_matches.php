<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-User-ID');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Vérifier si l'utilisateur est connecté
    $userId = isset($_SERVER['HTTP_X_USER_ID']) ? $_SERVER['HTTP_X_USER_ID'] : null;
    if (!$userId) {
        throw new Exception('Utilisateur non connecté');
    }

    // 1. Récupérer les déclarations de l'utilisateur
    $stmt = $db->prepare("
        SELECT d.*, o.*, c.name as category_name, u.name as username
        FROM declarations d 
        JOIN objets o ON d.objet_id = o.id 
        JOIN categories c ON o.category_id = c.id 
        JOIN users u ON d.user_id = u.id
        WHERE d.user_id = :userId AND d.returned != 1
    ");
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
    $userDeclarations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $matches = [];

    // 2. Pour chaque déclaration de l'utilisateur, chercher les correspondances
    foreach ($userDeclarations as $userDecl) {
        $oppositeType = $userDecl['type'] === 'found' ? 'lost' : 'found';
        
        // Chercher les déclarations correspondantes
        $stmt = $db->prepare("
            SELECT d.*, o.*, c.name as category_name, u.name as username
            FROM declarations d 
            JOIN objets o ON d.objet_id = o.id 
            JOIN categories c ON o.category_id = c.id 
            JOIN users u ON d.user_id = u.id
            WHERE d.type = :type 
            AND d.returned != 1 
            AND d.user_id != :userId
        ");
        $stmt->bindParam(':type', $oppositeType);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $potentialMatches = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 3. Calculer le score pour chaque correspondance potentielle
        foreach ($potentialMatches as $match) {
            $score = 0;
            
            // Même catégorie (40 points)
            if ($userDecl['category_id'] === $match['category_id']) {
                $score += 40;
            }
            
            // Même lieu (30 points)
            if (stripos($userDecl['location'], $match['location']) !== false || 
                stripos($match['location'], $userDecl['location']) !== false) {
                $score += 30;
            }
            
            // Date proche (30 points)
            $date1 = new DateTime($userDecl['date_incident']);
            $date2 = new DateTime($match['date_incident']);
            $diff = abs($date1->diff($date2)->days);
            if ($diff <= 7) {
                $score += 30;
            }
            
            // Description similaire (30 points)
            if (stripos($userDecl['description'], $match['description']) !== false || 
                stripos($match['description'], $userDecl['description']) !== false) {
                $score += 30;
            }

            // 4. Si le score est suffisant, ajouter au tableau des matches
            if ($score >= 60) {
                $matches[] = [
                    'found' => $userDecl['type'] === 'found' ? [
                        'id' => $userDecl['id'],
                        'title' => $userDecl['title'],
                        'description' => $userDecl['description'],
                        'location' => $userDecl['location'],
                        'date_incident' => $userDecl['date_incident'],
                        'image_url' => $userDecl['image_url'],
                        'category_name' => $userDecl['category_name'],
                        'user' => [
                            'id' => $userId,
                            'username' => $userDecl['username']
                        ]
                    ] : [
                        'id' => $match['id'],
                        'title' => $match['title'],
                        'description' => $match['description'],
                        'location' => $match['location'],
                        'date_incident' => $match['date_incident'],
                        'image_url' => $match['image_url'],
                        'category_name' => $match['category_name'],
                        'user' => [
                            'id' => $match['user_id'],
                            'username' => $match['username']
                        ]
                    ],
                    'lost' => $userDecl['type'] === 'lost' ? [
                        'id' => $userDecl['id'],
                        'title' => $userDecl['title'],
                        'description' => $userDecl['description'],
                        'location' => $userDecl['location'],
                        'date_incident' => $userDecl['date_incident'],
                        'image_url' => $userDecl['image_url'],
                        'category_name' => $userDecl['category_name'],
                        'user' => [
                            'id' => $userId,
                            'username' => $userDecl['username']
                        ]
                    ] : [
                        'id' => $match['id'],
                        'title' => $match['title'],
                        'description' => $match['description'],
                        'location' => $match['location'],
                        'date_incident' => $match['date_incident'],
                        'image_url' => $match['image_url'],
                        'category_name' => $match['category_name'],
                        'user' => [
                            'id' => $match['user_id'],
                            'username' => $match['username']
                        ]
                    ],
                    'score' => $score
                ];
            }
        }
    }

    // 5. Trier les matches par score décroissant
    usort($matches, function($a, $b) {
        return $b['score'] - $a['score'];
    });

    echo json_encode([
        'success' => true,
        'matches' => $matches
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 