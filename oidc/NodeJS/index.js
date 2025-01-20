import express from "express";
import * as oauth from 'oauth4webapi';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const issuer = new URL(process.env.ENTRA_ID);
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

let nonce, code_verifier;
let as, clientAuth;

(async () => {
  as = await oauth.discoveryRequest(issuer).then((response) =>
    oauth.processDiscoveryResponse(issuer, response)
  );

  clientAuth = oauth.ClientSecretPost(client_secret);
  code_verifier = oauth.generateRandomCodeVerifier();
})();

app.get("/", async (req, res) => {
  const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
  const code_challenge_method = 'S256';

  const authorizationUrl = new URL(as.authorization_endpoint);
  authorizationUrl.searchParams.set('client_id', client_id);
  authorizationUrl.searchParams.set('redirect_uri', redirect_uri);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid email profile');
  authorizationUrl.searchParams.set('code_challenge', code_challenge);
  authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method);

  if (as.code_challenge_methods_supported?.includes('S256') !== true) {
    nonce = oauth.generateRandomNonce();
    authorizationUrl.searchParams.set('nonce', nonce);
  }

  res.redirect(authorizationUrl.href);
});

app.get("/home", async (req, res) => {
  try {
    const currentUrl = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
    const params = oauth.validateAuthResponse(as, { client_id }, currentUrl);

    const response = await oauth.authorizationCodeGrantRequest(
      as,
      { client_id },
      clientAuth,
      params,
      redirect_uri,
      code_verifier
    );

    const result = await oauth.processAuthorizationCodeResponse(as, { client_id }, response, {
      expectedNonce: nonce,
      requireIdToken: true,
    });

    const { access_token } = result;
    const claims = oauth.getValidatedIdTokenClaims(result);
    const { sub } = claims;

    console.log("Access Token Response", result);
    console.log("ID Token Claims", claims);

    const userInfoResponse = await oauth.userInfoRequest(as, { client_id }, access_token);
    const userInfo = await oauth.processUserInfoResponse(as, { client_id }, sub, userInfoResponse);

    res.send("Login successful! UserInfo: " + JSON.stringify(userInfo));
  } catch (error) {
    console.error("Error handling callback:", error);
    res.status(500).send("Authentication failed");
  }
});

app.listen(10000, () => {
  console.log("Server is running on http://localhost:10000");
});
