<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Configuration CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

    // Récupérer les données JSON
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['objet'])) {
        throw new Exception('Données invalides');
    }

    // Validation des champs requis pour l'objet
    $requiredObjetFields = ['title', 'description', 'category_id'];
    foreach ($requiredObjetFields as $field) {
        if (empty($data['objet'][$field])) {
            throw new Exception("Le champ objet.$field est requis");
        }
    }

    // Validation des champs requis pour la déclaration
    $requiredDeclarationFields = ['type', 'location', 'date_incident', 'contact_email'];
    foreach ($requiredDeclarationFields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Le champ $field est requis");
        }
    }

    // Connexion à la base de données
    $database = new Database();
    $db = $database->getConnection();

    // Vérifier si l'utilisateur existe
    $stmt = $db->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    if (!$stmt->fetch()) {
        throw new Exception('Utilisateur invalide');
    }

    // Démarrer une transaction
    $db->beginTransaction();

    try {
    // Validation de la catégorie
    $stmt = $db->prepare("SELECT id FROM categories WHERE id = ?");
        $stmt->execute([$data['objet']['category_id']]);
    if (!$stmt->fetch()) {
        throw new Exception('Catégorie invalide');
    }

        // Insertion de l'objet
        $query = "INSERT INTO objets (
        title, 
        description, 
        category_id, 
            image_url,
            created_at
        ) VALUES (
            :title,
            :description,
            :category_id,
            :image_url,
            NOW()
        )";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':title', $data['objet']['title']);
        $stmt->bindParam(':description', $data['objet']['description']);
        $stmt->bindParam(':category_id', $data['objet']['category_id']);
        $stmt->bindParam(':image_url', $data['objet']['image_url']);

        if (!$stmt->execute()) {
            throw new Exception('Erreur lors de l\'enregistrement de l\'objet');
        }

        $objet_id = $db->lastInsertId();

        // Insertion de la déclaration
        $query = "INSERT INTO declarations (
            objet_id,
            user_id,
        type, 
        location, 
        date_incident, 
        contact_email, 
        auth_question, 
        auth_answer,
        created_at
    ) VALUES (
            :objet_id,
            :user_id,
        :type,
        :location,
        :date_incident,
        :contact_email,
        :auth_question,
        :auth_answer,
        NOW()
    )";

    $stmt = $db->prepare($query);
        $stmt->bindParam(':objet_id', $objet_id);
        $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':type', $data['type']);
    $stmt->bindParam(':location', $data['location']);
    $stmt->bindParam(':date_incident', $data['date_incident']);
    $stmt->bindParam(':contact_email', $data['contact_email']);
    $stmt->bindParam(':auth_question', $data['auth_question']);
    $stmt->bindParam(':auth_answer', $data['auth_answer']);

        if (!$stmt->execute()) {
            throw new Exception('Erreur lors de l\'enregistrement de la déclaration');
        }

        // Valider la transaction
        $db->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Déclaration enregistrée avec succès',
            'data' => [
                'id' => $db->lastInsertId()
            ]
        ]);

    } catch (Exception $e) {
        // Annuler la transaction en cas d'erreur
        $db->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 