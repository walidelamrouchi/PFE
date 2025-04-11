<?php
// objects.php
// Gestion des objets perdus et trouvés

include 'config.php'; // Inclure le fichier de configuration

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action']; // Récupérer l'action (ajout ou recherche)

    if ($action === 'add') {
        // Ajouter un nouvel objet
        $title = $_POST['title']; // Récupérer le titre de l'objet
        $description = $_POST['description']; // Récupérer la description
        $location = $_POST['location']; // Récupérer le lieu
        $date = $_POST['date']; // Récupérer la date

        // Gestion de l'upload d'image
        $imagePath = ''; // Initialiser le chemin de l'image
        if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
            $imagePath = 'uploads/' . basename($_FILES['image']['name']); // Chemin de l'image
            move_uploaded_file($_FILES['image']['tmp_name'], $imagePath); // Déplacer l'image téléchargée
        }

        // Requête pour insérer l'objet dans la base de données
        $query = "INSERT INTO objects (title, description, location, date, image) VALUES ('$title', '$description', '$location', '$date', '$imagePath')";
        if (mysqli_query($connection, $query)) {
            echo json_encode(['status' => 'success']); // Réponse en cas de succès
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'ajout de l\'objet']);
        }
    } elseif ($action === 'search') {
        // Recherche d'objets
        $keyword = $_POST['keyword']; // Récupérer le mot-clé de recherche

        // Requête pour rechercher des objets dans la base de données
        $query = "SELECT * FROM objects WHERE title LIKE '%$keyword%' OR description LIKE '%$keyword%'";
        $result = mysqli_query($connection, $query);
        $objects = []; // Initialiser le tableau des objets

        // Récupérer tous les objets correspondants
        while ($row = mysqli_fetch_assoc($result)) {
            $objects[] = $row; // Ajouter chaque objet au tableau
        }

        echo json_encode($objects); // Retourner les objets trouvés
    }
}
?>