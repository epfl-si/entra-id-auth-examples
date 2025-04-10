# Example of migration from Tequila (PHP Client) to Entra

This page gives an example on how to migrate a website that uses Tequila PHP client to now use Entra authentication.

For the given example, the website has a single `index.php` page through which everything is done. You may adapt it for your own needs.

## What you'll basically will need to do

**Note** More detailed information below

- Determine if you have groups (on https://groups.epfl.ch) for which you want to know if user is part of (you'll need the explicit list and **all will have to be synchronized in AD/LDAP**).
- Declare your app/website on https://app-portal.epfl.ch
- Install needed library using **composer**
- Create `.env` file with information
- Create a "callback" page (will be in `entra/entra.php` file on your website)
- Modify root page of your app (`index.php`) to remove Tequila and use Entra ("callback" page)


## Detailed procedure

### Declare application on app-portal

Go on http://app-portal.epfl.ch and choose to create a new application.

Information you have to give are pretty obvious but here are some information about some of them.

**Application Type:** you'll have to choose `Web App` for your website to work correctly.

**Application redirect URLs:** In our case it will be something like `http://<mywebsite>/entra/entra.php`.

**Additionnal authorized Groups:** Here, add all the groups you'll need to know if the user is part of them.

When you submit the form for application creation, you'll get several information, and also a "client secret" that you'll have to store somewhere.


### Install library

First of all, go the the root directory where the files of your website are located.

Use **composer** to install required library
```bash
composer require jumbojett/openid-connect-php
```


### Entra configuration file
Then, create a `entra/` folder in the root directory of your website:
```bash
mkdir entra
```
In the `entra/` directory created above, create a `.env` file with the following:

```ini
AUTH_URL="https://login.microsoftonline.com/[tenant_id]/v2.0" # [tenant_id] can be found in "Directory (Tenant) Id" field on app-portal.epfl.ch
CLIENT_ID="[client_id]" # Is "Application (Client) Id" on app-portal.epfl.ch
CLIENT_SECRET="[client_secret]" # Has been given when you created the application on app-portal.epfl.ch
OIDC_REDIRECT_URI="http://<mywebsite>/entra/entra.php" # For this example. Just replate <mywebsite> with correct value
```

### Callback page

In our example, "callback" page will be `entra/entra.php` (because for Tequila it was `tequila/tequila.php`).
The content will be the following:

```php
require_once(__DIR__ . '/../vendor/autoload.php');
use Jumbojett\OpenIDConnectClient;

// This include is for the example, because we'll need 'WEBSITE_URL' value at the end
require_once(__DIR__ . '/../include/config.inc.php');

// Read configuration
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

session_start();
// Init Entra client
$oidc = new OpenIDConnectClient($_ENV['AUTH_URL'], $_ENV['CLIENT_ID'], $_ENV['CLIENT_SECRET']);
$oidc->setRedirectURL($_ENV['OIDC_REDIRECT_URI']);
$oidc->setResponseTypes(['code']);
$oidc->authenticate();

// Get user information
$_SESSION['user'] = $oidc->requestUserInfo();
// This will allow you to have 'sciper' (uniqueid) and 'username' (gaspar) information
$_SESSION['claims'] = $oidc->getVerifiedClaims();

// Go back to website
header("Location: ".WEBSITE_URL);
exit;
```

### Website root page (index.php)

Look into thyour existing `index.php` file to find the section with Tequila part. In our example, let's say that we have the following code for Tequila

```php
// Authentication
$oClient = new TequilaClient();   
$oClient->SetApplicationName('Avengers Tower');
$oClient->SetWantedAttributes(array('unit', 'where', 'group', 'email', 'firstname', 'uniqueid', 'username', 'name'));
$oClient->SetAllowsFilter("categorie=EPFL-Guests|categorie=epfl-old");

if($oClient->Authenticate() === false)
{
    $oClient->Logout("//".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);
}

// init user details
define('USER_EMAIL', $oClient->getValue('email'));
define('USER_SCIPER', $oClient->getValue('uniqueid'));
define('USER_FULL_NAME', mb_convert_encoding($oClient->getValue('firstname') . " " . $oClient->getValue('name'), 'ISO-8859-1', 'UTF-8'));
define('USER_GROUPS', $oClient->getValue('group')); // string with group names, separated with commas
```

This will have to be replaced with the following (note that some previous options of Tequila won't be in Entra code)
```php
// Authentication
session_start(); 
if (!isset($_SESSION['user']))
{
    header("Location: ".$_ENV['ENTRA_REDIRECT_URL']);
    exit();
}

// init user details
define('USER_EMAIL', $_SESSION["user"]->email);
define('USER_SCIPER', $_SESSION["claims"]->uniqueid);
define('USER_FULL_NAME',  $_SESSION["user"]->name);
// We'll recreate the string with group names separated by commas and remove "_AppGrpU" suffix (because Entra will return AD Groups corresponding to https://groups.epfl.ch groups, and they doesn't have the same name)
$group_list = array();
foreach ($_SESSION["claims"]->groups as $ad_group_name)
{
   $group_list[] = str_replace("_AppGrpU", "", $ad_group_name);
}
define('USER_GROUPS', implode(",", $group_list));
```

### Cleaning
Don't forget to have a look on your website code to see if there are others mentions to Tequila and clean them.