import * as oauth from 'oauth4webapi';
import dotenv from 'dotenv';
dotenv.config();

const issuer = new URL(process.env.AUTH_URL);
let algorithm
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const scope = process.env.SCOPE;

const as = await oauth
  .discoveryRequest(issuer, { algorithm })
  .then((response) => oauth.processDiscoveryResponse(issuer, response))

const client = { client_id }
const clientAuth = oauth.ClientSecretPost(client_secret)

let access_token
{
  const parameters = new URLSearchParams()
  parameters.set('scope', scope) //ex. api://[client_id]/.default or openid, etc.

  const response = await oauth.clientCredentialsGrantRequest(as, client, clientAuth, parameters)

  const result = await oauth.processClientCredentialsResponse(as, client, response)

  console.log('Access Token Response', result)
  ;({ access_token } = result)
}