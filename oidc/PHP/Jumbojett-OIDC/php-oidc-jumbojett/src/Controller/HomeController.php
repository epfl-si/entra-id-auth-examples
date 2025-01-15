<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use Jumbojett\OpenIDConnectClient;

class HomeController extends AbstractController
{
    #[Route('/home', name: 'app_home')]
    public function home(Request $request): Response
    {
        $oidc = new OpenIDConnectClient('https://login.microsoftonline.com/' . $_ENV['TENANT_ID'], $_ENV['CLIENT_ID'], $_ENV['CLIENT_SECRET']);
        $oidc->setRedirectURL($_ENV['OIDC_REDIRECT_URI']);
    
        $oidc->authenticate();
        $userInfo = $oidc->requestUserInfo();

        $session = $request->getSession();
        $session->set('user_info', $userInfo);
        $user = $session->get('user_info', null);

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'user' => $user,
        ]);
    }
}
