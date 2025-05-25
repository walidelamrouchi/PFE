<?php
require_once 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class JwtHandler {
    private $jwt_secret = "votre_secret_jwt_super_securise";
    private $token_expiry = 3600; // 1 heure

    public function generateToken($user_data) {
        $issued_at = time();
        $expire = $issued_at + $this->token_expiry;

        $payload = array(
            "iat" => $issued_at,
            "exp" => $expire,
            "user" => array(
                "id" => $user_data['id'],
                "email" => $user_data['email'],
                "role" => $user_data['role']
            )
        );

        return JWT::encode($payload, $this->jwt_secret, 'HS256');
    }

    /**
     * @param string $token
     * @return \stdClass|null
     */
    public function validateToken($token) {
        try {
            return JWT::decode($token, new Key($this->jwt_secret, 'HS256'));
        } catch(Exception $e) {
            return null; // Retourne null en cas d'erreur
        }
    }
}
?> 