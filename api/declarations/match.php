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
require_once '../helpers/google_helpers.php';

// Clé API Google Vision
define('GOOGLE_VISION_API_KEY', 'AIzaSyAjJ7NqwrAxUyZoC4ESFonsyMamovVWWLs');

try {
    $database = new Database();
    $db = $database->getConnection();

    // Vérifier si l'utilisateur est connecté
    $userId = isset($_SERVER['HTTP_X_USER_ID']) ? $_SERVER['HTTP_X_USER_ID'] : null;
    if (!$userId) {
        throw new Exception('Utilisateur non connecté');
    }

    // Récupérer les IDs depuis l'URL
    $matchIds = isset($_GET['ids']) ? $_GET['ids'] : null;
    if (!$matchIds) {
        throw new Exception('IDs de match non spécifiés');
    }

    // Séparer les IDs (format: foundId_lostId)
    list($foundId, $lostId) = explode('_', $matchIds);

    // Récupérer les détails des deux déclarations
    $stmt = $db->prepare("
        SELECT d.*, o.*, c.name as category_name, u.name as username, u.email
        FROM declarations d 
        JOIN objets o ON d.objet_id = o.id 
        JOIN categories c ON o.category_id = c.id 
        JOIN users u ON d.user_id = u.id
        WHERE d.id IN (:foundId, :lostId)
    ");
    $stmt->bindParam(':foundId', $foundId);
    $stmt->bindParam(':lostId', $lostId);
    $stmt->execute();
    $declarations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($declarations) !== 2) {
        throw new Exception('Déclarations non trouvées');
    }

    // Séparer les déclarations trouvées et perdues
    $found = null;
    $lost = null;
    foreach ($declarations as $decl) {
        if ($decl['type'] === 'found') {
            $found = $decl;
        } else {
            $lost = $decl;
        }
    }

    if (!$found || !$lost) {
        throw new Exception('Déclarations invalides');
    }

    // Calculer le score de correspondance
    $score = 0;
    $scoreDetails = [];
    
    // Même catégorie (40 points)
    if ($found['category_id'] === $lost['category_id']) {
        $score += 40;
        $scoreDetails['category'] = 40;
    } else {
        $scoreDetails['category'] = 0;
    }
    
    // Même lieu (30 points)
    if (stripos($found['location'], $lost['location']) !== false || 
        stripos($lost['location'], $found['location']) !== false) {
        $score += 30;
        $scoreDetails['location'] = 30;
    } else {
        $scoreDetails['location'] = 0;
    }
    
    // Date proche (30 points)
    $date1 = new DateTime($found['date_incident']);
    $date2 = new DateTime($lost['date_incident']);
    $diff = abs($date1->diff($date2)->days);
    if ($diff <= 7) {
        $score += 30;
        $scoreDetails['date'] = 30;
    } else {
        $scoreDetails['date'] = 0;
    }
    
    // Description similaire (30 points)
    if (stripos($found['description'], $lost['description']) !== false || 
        stripos($lost['description'], $found['description']) !== false) {
        $score += 30;
        $scoreDetails['description'] = 30;
    } else {
        $scoreDetails['description'] = 0;
    }

    // Analyse des images avec Google Vision API
    $imageScore = 0;
    $commonLabels = [];
    
    if ($found['image_url'] && $lost['image_url']) {
        // Normaliser les URLs des images pour qu'elles soient toujours relatives à la racine du projet
        // Supposons que toutes les images sont stockées sous 'uploads/' à la racine du projet PFE
        $foundImageUrlNormalized = str_replace('/api/', '', $found['image_url']);
        $lostImageUrlNormalized = str_replace('/api/', '', $lost['image_url']);

        // Supprimer tout slash initial si présent après la normalisation
        $foundImageUrlNormalized = ltrim($foundImageUrlNormalized, '/');
        $lostImageUrlNormalized = ltrim($lostImageUrlNormalized, '/');

        // Construire les chemins d'accès absolus au système de fichiers à partir de l'emplacement du script
        // match.php est dans api/declarations/, donc '../../' nous ramène à la racine du projet.
        $foundImagePath = '../../' . $foundImageUrlNormalized;
        $lostImagePath = '../../' . $lostImageUrlNormalized;

        error_log("Chemin de l'image trouvée: " . $foundImagePath);
        error_log("Chemin de l'image perdue: " . $lostImagePath);
        
        // Récupérer les labels des deux images
        $foundLabels = getImageLabels($foundImagePath, GOOGLE_VISION_API_KEY);
        $lostLabels = getImageLabels($lostImagePath, GOOGLE_VISION_API_KEY);

        error_log("Labels de l'image trouvée: " . json_encode($foundLabels));
        error_log("Labels de l'image perdue: " . json_encode($lostLabels));
        
        // Calculer le score de correspondance des images
        $imageMatch = calculateImageMatchScore($foundLabels, $lostLabels);
        $imageScore = $imageMatch['score'];
        $commonLabels = $imageMatch['common_labels'];
        
        // Ajouter le score d'image au score total
        $score += $imageScore;
        $scoreDetails['image'] = $imageScore;
    } else {
        $scoreDetails['image'] = 0;
    }

    // Préparer la réponse
    $response = [
        'found' => [
            'id' => $found['id'],
            'title' => $found['title'],
            'description' => $found['description'],
            'location' => $found['location'],
            'date_incident' => $found['date_incident'],
            'image_url' => $found['image_url'],
            'category_name' => $found['category_name'],
            'user' => [
                'id' => $found['user_id'],
                'username' => $found['username'],
                'email' => $found['email']
            ]
        ],
        'lost' => [
            'id' => $lost['id'],
            'title' => $lost['title'],
            'description' => $lost['description'],
            'location' => $lost['location'],
            'date_incident' => $lost['date_incident'],
            'image_url' => $lost['image_url'],
            'category_name' => $lost['category_name'],
            'user' => [
                'id' => $lost['user_id'],
                'username' => $lost['username'],
                'email' => $lost['email']
            ]
        ],
        'score' => $score,
        'score_details' => $scoreDetails,
        'score_image' => $imageScore,
        'labels_communs' => $commonLabels,
        'isUserInvolved' => ($found['user_id'] == $userId || $lost['user_id'] == $userId)
    ];

    echo json_encode([
        'success' => true,
        'match' => $response
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}