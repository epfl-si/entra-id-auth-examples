# This file cover authentification through OIDC
# It will redirect to login page of Entra ID if not connected

from flask import Flask, g, session
from flask_oidc import OpenIDConnect
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)

app.secret_key = os.environ["APP_SECRET_KEY"]
app.config["OIDC_CLIENT_SECRETS"]="client_secrets.json"

oidc = OpenIDConnect(app)

@app.route('/')
@oidc.require_login
def index():
    if oidc.user_loggedin:
        return 'Welcome %s' % session["oidc_auth_profile"].get('email')
    else:
        return 'Not logged in'

