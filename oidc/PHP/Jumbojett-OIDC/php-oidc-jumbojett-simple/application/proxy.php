<?php
require '../auth/global_function.php';


// Utilisation des fonctions
session_start();

// Vérifier si l'utilisateur est connecté
if (!isUserConnected()) {
    die("NOT CONNECTED");
}

// Do your process
