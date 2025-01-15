<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use Jumbojett\OpenIDConnectClient;

class LoginController extends AbstractController
{
    #[Route('/login', name: 'app_login')]
    public function login(Request $request): Response
    {
        $oidc = new OpenIDConnectClient('https://login.microsoftonline.com/'. $_ENV['TENANT_ID'].'/v2.0', $_ENV['CLIENT_ID'], $_ENV['CLIENT_SECRET']);
        $oidc->setRedirectURL($_ENV['OIDC_REDIRECT_URI']);
        $oidc->addScope(['openid', 'profile', 'email']);

        return $this->redirectToRoute('app_home');
    }
}
