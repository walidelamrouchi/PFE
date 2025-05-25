<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Vérifier si la table existe
    $stmt = $db->query("SHOW TABLES LIKE 'declarations'");
    if ($stmt->rowCount() === 0) {
        // La table n'existe pas, la créer
        $db->exec("CREATE TABLE IF NOT EXISTS declarations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            category_id INT NOT NULL,
            type ENUM('lost', 'found') NOT NULL,
            location VARCHAR(255) NOT NULL,
            date_incident DATE NOT NULL,
            image_url VARCHAR(255),
            contact_email VARCHAR(255) NOT NULL,
            auth_question TEXT,
            auth_answer TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )");
        
        echo json_encode([
            'success' => true,
            'message' => 'Table declarations créée avec succès'
        ]);
    } else {
        // Vérifier la structure de la table
        $stmt = $db->query("DESCRIBE declarations");
        $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (!in_array('title', $columns)) {
            // La colonne title n'existe pas, recréer la table
            $db->exec("DROP TABLE declarations");
            $db->exec("CREATE TABLE declarations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                category_id INT NOT NULL,
                type ENUM('lost', 'found') NOT NULL,
                location VARCHAR(255) NOT NULL,
                date_incident DATE NOT NULL,
                image_url VARCHAR(255),
                contact_email VARCHAR(255) NOT NULL,
                auth_question TEXT,
                auth_answer TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )");
            
            echo json_encode([
                'success' => true,
                'message' => 'Table declarations recréée avec succès'
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'message' => 'Table declarations existe déjà avec la bonne structure'
            ]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 