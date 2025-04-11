<?php
// auth.php
// Gestion de l'authentification des utilisateurs

include 'config.php'; // Inclure le fichier de configuration

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action']; // Récupérer l'action (inscription ou connexion)

    if ($action === 'register') {
        // Inscription d'un nouvel utilisateur
        $username = $_POST['username']; // Récupérer le nom d'utilisateur
        $password = $_POST['password']; // Récupérer le mot de passe

        // Hachage du mot de passe pour le stocker en toute sécurité
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Requête pour insérer l'utilisateur dans la base de données
        $query = "INSERT INTO users (username, password) VALUES ('$username', '$hashed_password')";
        if (mysqli_query($connection, $query)) {
            echo json_encode(['status' => 'success']); // Réponse en cas de succès
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'inscription']);
        }
    } elseif ($action === 'login') {
        // Connexion d'un utilisateur
        $username = $_POST['username']; // Récupérer le nom d'utilisateur
        $password = $_POST['password']; // Récupérer le mot de passe

        // Requête pour récupérer l'utilisateur de la base de données
        $query = "SELECT * FROM users WHERE username = '$username'";
        $result = mysqli_query($connection, $query);
        $user = mysqli_fetch_assoc($result); // Récupérer les données de l'utilisateur

        // Vérification du mot de passe
        if ($user && password_verify($password, $user['password'])) {
            echo json_encode(['status' => 'success', 'user' => $user]); // Réponse en cas de succès
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Identifiants invalides']); // Réponse en cas d'erreur
        }
    }
}
?>