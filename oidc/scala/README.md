# Scala Authentication with Entra ID using http4s and MSAL4J

Open Source implementation of OpenID Connect authentication using Microsoft Entra ID (formerly Azure AD) in Scala web applications.

## Try this repository in your local environment

1. Use the EPFL App Portal or Entra Admin Portal to create your application registration:

    * Application Type: `Web`
    * Redirect URI: `http://localhost:8080/redirect`
    * Platform Configuration: Enable public client flows if using code flow without secret

2. Clone the repository:

   ```bash
   git clone https://github.com/epfl-si/entra-id-auth-examples.git
   ```

3. Change to the repository directory:

   ```bash
   cd entra-id-auth-examples/oidc/scala
   ```

4. Create or update your `.env` file with your Entra ID credentials:

   ```env
   CLIENT_ID=<your_client_id>
   CLIENT_SECRET=<your_client_secret>
   TENANT_ID=<your_tenant_id>
   REDIRECT_URI=http://localhost:8080/redirect
   ```

5. Run the application:

   ```bash
   ./start.sh
   ```

   The server will start on `http://localhost:8080`

## How to Reuse this in Your Own Project

To integrate this authentication mechanism into your own http4s project:

1. **Copy the `auth/Authenticator.scala`** into your project:

2. **Update your environment variables** to match your own application credentials.

3. **Protect your routes** using the session middleware:

   ```scala
   val protectedRoutes = Authenticator.sessionMiddleware(yourAuthedRoutes)
   ```
   
4. **Provide login, redirect, and logout endpoints** similar to `Routes.scala`:

    * `/login`: Redirects user to Microsoft login
    * `/redirect`: Handles the auth code and sets a secure session cookie
    * `/logout`: Clears the session and redirects to Entra ID logout URL

5. **Add a logout button** to your protected HTML pages, for example:

   ```html
   <form action="/logout" method="post">
     <button type="submit">Disconnect</button>
   </form>
   ```

## HTTP Routes Overview

* `/login`: Starts Entra ID login
* `/redirect`: Processes Entra ID response and stores session token
* `/logout`: Ends the session and redirects to Microsoft logout
* `/`: A protected homepage displaying the logged-in user's identity and a logout button

## Key Files and Roles

### `auth/Authenticator.scala`

Handles all authentication logic:

* Creates the authorization request URL
* Exchanges code for token using MSAL4J
* Extracts claims and verifies session cookie
* Provides an `AuthMiddleware` to secure routes
* Implements session termination via logout

### `routes/Routes.scala`

* Wires up http4s routes with the authenticator
* Handles login, redirect, logout
* Shows a sample authenticated route

### `Main.scala`

* Starts http4s server and mounts the routes
