<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Configuration CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-User-ID');
header('Content-Type: application/json');

// Gérer la requête OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

    // Vérifier si l'ID de la déclaration est fourni
    if (!isset($_GET['id'])) {
        throw new Exception('ID de déclaration manquant');
    }

    $declaration_id = $_GET['id'];

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

    // Vérifier si la déclaration appartient à l'utilisateur
    $stmt = $db->prepare("SELECT objet_id FROM declarations WHERE id = ? AND user_id = ?");
    $stmt->execute([$declaration_id, $user_id]);
    $declaration = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$declaration) {
        throw new Exception('Déclaration non trouvée ou accès non autorisé');
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

        // Mise à jour de l'objet
        $query = "UPDATE objets SET 
            title = :title,
            description = :description,
            category_id = :category_id,
            image_url = :image_url,
            updated_at = NOW()
        WHERE id = :id";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':title', $data['objet']['title']);
        $stmt->bindParam(':description', $data['objet']['description']);
        $stmt->bindParam(':category_id', $data['objet']['category_id']);
        $stmt->bindParam(':image_url', $data['objet']['image_url']);
        $stmt->bindParam(':id', $declaration['objet_id']);

        if (!$stmt->execute()) {
            throw new Exception('Erreur lors de la mise à jour de l\'objet');
        }

        // Mise à jour de la déclaration
        $query = "UPDATE declarations SET 
            type = :type,
            location = :location,
            date_incident = :date_incident,
            contact_email = :contact_email,
            auth_question = :auth_question,
            auth_answer = :auth_answer
        WHERE id = :id AND user_id = :user_id";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':type', $data['type']);
        $stmt->bindParam(':location', $data['location']);
        $stmt->bindParam(':date_incident', $data['date_incident']);
        $stmt->bindParam(':contact_email', $data['contact_email']);
        $stmt->bindParam(':auth_question', $data['auth_question']);
        $stmt->bindParam(':auth_answer', $data['auth_answer']);
        $stmt->bindParam(':id', $declaration_id);
        $stmt->bindParam(':user_id', $user_id);

        if (!$stmt->execute()) {
            throw new Exception('Erreur lors de la mise à jour de la déclaration');
        }

        // Valider la transaction
        $db->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Déclaration mise à jour avec succès'
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
