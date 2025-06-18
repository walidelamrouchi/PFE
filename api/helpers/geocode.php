<?php
$adresse = "Rabat, Maroc";
$cle_api = "AIzaSyAjJ7NqwrAxUyZoC4ESFonsyMamovVWWLs";
$url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($adresse) . "&key=" . $cle_api;

$response = file_get_contents($url);
$data = json_decode($response, true);

// Vérifie si l'API a bien répondu
if ($data['status'] == 'OK') {
    echo "Latitude : " . $data['results'][0]['geometry']['location']['lat'] . "<br>";
    echo "Longitude : " . $data['results'][0]['geometry']['location']['lng'];
} else {
    echo "Erreur API : " . $data['status'];
}
?>
