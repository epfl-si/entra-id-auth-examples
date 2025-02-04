<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
require 'autoload.php'; // Inclure l'autoloader

use Jumbojett\OpenIDConnectClient;
use phpseclib3\Crypt\RSA\PrivateKey;
use phpseclib3\Crypt\RSA\PublicKey;

session_start();

// Configure client
$oidc = new OpenIDConnectClient(
    'https://login.microsoftonline.com/{TENANT_ID}/v2.0',
    'CLIENT_ID',
    'CLIENT_SECRET'
);
$oidc->setRedirectURL('https://malocation/auth/callback.php');


if (isset($_GET['logout'])) {
    // Delete Session & Cache
    $_SESSION = array();
    $_COOKIE = array();
    $_COOKIE['PHPSESSID'] = 'null';

    session_unset(); // Effacer toutes les variables de session
    session_write_close(); 
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    header('Location: https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/logout');
    exit();
}
else {
    $oidc->authenticate();

    $userInfo = $oidc->requestUserInfo();
    $_SESSION['user'] = $userInfo; // Stocker les informations de l'utilisateur en session

    header('Location: /auth/index.php');
    exit();
}


