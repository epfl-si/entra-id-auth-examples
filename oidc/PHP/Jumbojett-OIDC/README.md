# OpenID-Connect-PHP

Open Source implementation of OpenID Connect for PHP applications.
Tested with PHP 8.4.1 and composer 2.8.4

## Try this repository in your local environment

1. Clone the repository:

   ```bash
   git clone https://github.com/epfl-si/entra-id-auth-examples.git
   ```

2. Change to the repository directory:

   a. If you want to use the simple example:

   ```bash
   cd entra-id-auth-examples/oidc/PHP/Jumbojett-OIDC/php-oidc-jumbojett-simple
   ```

   b. If you want to use the symfony example:

   ```bash
   cd entra-id-auth-examples/oidc/PHP/Jumbojett-OIDC/php-oidc-jumbojett-symfony
   ```

3. Install dependencies

   You will need to install dependencies using composer:

   ```bash
   composer install
   ```

   You will need to activate curl on your php installation too.

   On ubuntu:

   ```bash
   sudo apt install php-curl
   ```

4. Configure environment variables:

   In ./.env

   ```bash
   AUTH_URL= "your_auth_url",
   CLIENT_ID= "your_client_id"
   CLIENT_SECRET= "your_client_secret"
   OIDC_REDIRECT_URI= "your_redirect_uri"
   ```

## Installation

1. Choose the [latest release](https://github.com/jumbojett/OpenID-Connect-PHP/releases)
2. Install the library using composer:

   ```bash
   composer require jumbojett/openid-connect-php "^VERSION"
   ```

   Or you can install it inside your vendor directory and use it directly without composer.

## Configuration

Example: `php-oidc-jumbojett-symfony` is an example of OpenID-Connect-PHP
in Symfony framework.

```php
$oidc = new OpenIDConnectClient($_ENV['AUTH_URL'], $_ENV['CLIENT_ID'], $_ENV['CLIENT_SECRET']);
$oidc->setRedirectURL($_ENV['OIDC_REDIRECT_URI']);
$oidc->addScope(['openid', 'profile', 'email']);

$oidc->authenticate();
$userInfo = $oidc->requestUserInfo();

$session = $request->getSession();
$session->set('user_info', $userInfo);
```

Another example: `php-oidc-jumbojett-simple` is an example of
OpenID-Connect-PHP without any framework.

### Logout

As session is used to store user information after login process, to logout the user you must clear the session:

```php
<?php
// Initialize the session.
// If you are using session_name("something"), don't forget it now!
session_start();

// Unset all of the session variables.
$_SESSION = array();

// Finally, destroy the session.
session_destroy();

// Then redirect with header location or other code..
?>

```

This process kills and cleans up the user's session on the server. As it is, the user will still be connected to the IDP.

## Documentation

- [Official Documentation](https://github.com/jumbojett/OpenID-Connect-PHP/)
