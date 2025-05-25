<?php
require_once __DIR__ . '/../../vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class JwtHandler {
    private const JWT_SECRET = "votre_secret_jwt_super_securise_2024";
    private const TOKEN_EXPIRY = 86400; // 24 heures
    private const REFRESH_TOKEN_EXPIRY = 604800; // 7 jours

    public function generateTokens($user_data) {
        $issued_at = time();
        
        // Token d'accès
        $access_token_expire = $issued_at + self::TOKEN_EXPIRY;
        $access_payload = [
            "iat" => $issued_at,
            "exp" => $access_token_expire,
            "user" => [
                "id" => $user_data['id'],
                "email" => $user_data['email'],
                "role" => $user_data['role']
            ]
        ];
        
        // Token de rafraîchissement
        $refresh_token_expire = $issued_at + self::REFRESH_TOKEN_EXPIRY;
        $refresh_payload = [
            "iat" => $issued_at,
            "exp" => $refresh_token_expire,
            "type" => "refresh",
            "user_id" => $user_data['id']
        ];

        return [
            'access_token' => JWT::encode($access_payload, self::JWT_SECRET, 'HS256'),
            'refresh_token' => JWT::encode($refresh_payload, self::JWT_SECRET, 'HS256'),
            'expires_in' => self::TOKEN_EXPIRY
        ];
    }

    public function validateToken($token) {
        try {
            return JWT::decode($token, new Key(self::JWT_SECRET, 'HS256'));
        } catch(Exception $e) {
            return null;
        }
    }

    public function refreshAccessToken($refresh_token) {
        $decoded = $this->validateToken($refresh_token);
        if (!$decoded || !isset($decoded->type) || $decoded->type !== 'refresh') {
            return null;
        }

        // Récupérer les données utilisateur depuis la base de données
        require_once __DIR__ . '/database.php';
        $database = new Database();
        $db = $database->getConnection();
        
        $query = "SELECT id, email, role FROM users WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$decoded->user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return null;
        }

        return $this->generateTokens($user);
    }
}
?> 