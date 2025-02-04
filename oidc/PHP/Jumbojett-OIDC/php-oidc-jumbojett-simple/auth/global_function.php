<?php

// Fonction pour vérifier si un utilisateur est connecté
function isUserConnected() {
    // Vérifier si la session contient les informations de l'utilisateur
    if (isset($_SESSION['user'])) {
        return true;
    }
    return false;
}
