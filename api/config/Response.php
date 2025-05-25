<?php
class Response {
    public static function json($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success($data = null, $message = 'Opération réussie') {
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }

    public static function error($message = 'Une erreur est survenue', $status = 400) {
        self::json([
            'success' => false,
            'message' => $message
        ], $status);
    }

    public static function unauthorized($message = 'Non autorisé') {
        self::error($message, 401);
    }

    public static function forbidden($message = 'Accès interdit') {
        self::error($message, 403);
    }

    public static function notFound($message = 'Ressource non trouvée') {
        self::error($message, 404);
    }

    public static function serverError($message = 'Erreur serveur') {
        self::error($message, 500);
    }
} 