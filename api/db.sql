-- Création de la base de données
CREATE DATABASE IF NOT EXISTS findit;
USE findit;

-- Table des utilisateurs
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des objets
CREATE TABLE IF NOT EXISTS objets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Table des déclarations
CREATE TABLE IF NOT EXISTS declarations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    objet_id INT NOT NULL,
    type ENUM('lost', 'found') NOT NULL,
    location VARCHAR(255) NOT NULL,
    date_incident DATE NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    auth_question TEXT,
    auth_answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (objet_id) REFERENCES objets(id)
);

-- Insertion des catégories par défaut
INSERT INTO categories (name, description) VALUES
('Téléphone', 'Téléphones portables et smartphones'),
('Ordinateur', 'Ordinateurs portables et accessoires'),
('Vêtement', 'Vêtements et accessoires vestimentaires'),
('Bijou', 'Bijoux et montres'),
('Clés', 'Clés et porte-clés'),
('Portefeuille', 'Portefeuilles et cartes'),
('Sac', 'Sacs et bagages'),
('Document', 'Documents et papiers importants'),
('Lunettes', 'Lunettes de vue et solaires'),
('Animal', 'Animaux perdus ou trouvés'),
('Autre', 'Autres objets non catégorisés');