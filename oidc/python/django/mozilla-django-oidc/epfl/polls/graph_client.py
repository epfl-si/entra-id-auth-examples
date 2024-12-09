import requests

class GraphClient:
    BASE_URL = "https://graph.microsoft.com/v1.0"
    
    def __init__(self, access_token):
        self.access_token = access_token
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {access_token}',
            'Accept': 'application/json'
        })
    
    def get_user_info(self):
        """Get detailed user information."""
        response = self.session.get(f"{self.BASE_URL}/me")
        response.raise_for_status()
        return response.json()
    
    def get_user_photo(self):
        """Get user's profile photo."""
        try:
            response = self.session.get(f"{self.BASE_URL}/me/photo/$value")
            response.raise_for_status()
            return response.content
        except requests.HTTPError:
            return None
    
    def get_user_groups(self):
        """Get user's groups."""
        response = self.session.get(f"{self.BASE_URL}/me/memberOf")
        response.raise_for_status()
        return response.json().get('value', [])
