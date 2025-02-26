<?php
require __DIR__ . '/vendor/autoload.php';
use Jumbojett\OpenIDConnectClient;

session_start(); 

if (!isset($_SESSION['user'])){
    header("Location: http://localhost:8000/callback.php");
    exit();
}

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>PHP OIDC</title>
</head>
<body>
    <h1>Hello <?php echo $_SESSION['user']->name?></h1>
</body>
</html>