from mozilla_django_oidc.auth import OIDCAuthenticationBackend
import jwt

class MyOIDCAB(OIDCAuthenticationBackend):
    def create_user(self, claims):
        user = super(MyOIDCAB, self).create_user(claims)

        user.username = claims.get('uniqueid') # Use sciper as username
        # user.username = claims.get('gaspar') # Use gaspar as username
        user.first_name = claims.get('given_name')
        user.last_name = claims.get('family_name')
        
        #user.sciper = claims.get('uniqueid') # Use custom user model
        user.save()

        return user

    def update_user(self, user, claims):
        user.username = claims.get('uniqueid') # Use sciper as username
        # user.username = claims.get('gaspar') # Use gaspar as username
        user.first_name = claims.get('given_name')
        user.last_name = claims.get('family_name')
        #user.sciper = claims.get('uniqueid') # Use custom user model
        user.save()

        return user

    def get_userinfo(self, access_token, id_token, payload):
        """
            Get user info from both user info endpoint (default) and
            merge with ID token information.
        """
        userinfo = super(MyOIDCAB, self).get_userinfo(access_token, id_token, payload)
        
        id_token_decoded: str = jwt.decode(
            id_token, options={"verify_signature": False}
        )

        userinfo.update(id_token_decoded)

        return userinfo
