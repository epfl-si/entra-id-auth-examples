<?php
require __DIR__ . '/vendor/autoload.php';

use Jumbojett\OpenIDConnectClient;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

session_start();

// Configure client
$oidc = new OpenIDConnectClient(
    $_ENV['AUTH_URL'], 
    $_ENV['CLIENT_ID'],
    $_ENV['CLIENT_SECRET']
);

$oidc->setRedirectURL($_ENV['OIDC_REDIRECT_URI']);
$oidc->setResponseTypes(['code']);

$oidc->authenticate();

//Retrieve and store user info
$userInfo = $oidc->requestUserInfo();
$_SESSION['user'] = $userInfo;

header("Location: http://localhost:8000/index.php");
exit();
?>