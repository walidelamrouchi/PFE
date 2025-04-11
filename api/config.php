<?php
// config.php
// Configuration de la base de données

$host = 'localhost'; // Adresse du serveur de base de données
$db = 'findit_db'; // Nom de la base de données
$user = 'root'; // Nom d'utilisateur de la base de données
$pass = ''; // Mot de passe de la base de données

// Connexion à la base de données
$connection = mysqli_connect($host, $user, $pass, $db);

// Vérification de la connexion
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}
?>