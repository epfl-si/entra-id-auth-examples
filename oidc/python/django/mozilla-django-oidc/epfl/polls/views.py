from django.shortcuts import render
from django.http import HttpRequest
from django.conf import settings

import requests


class GraphClient:
    BASE_URL = "https://graph.microsoft.com/v1.0"

    def __init__(self, access_token):
        self.access_token = access_token
        self.session = requests.Session()
        self.session.headers.update(
            {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
        )

    def get_user_info(self):
        """Get detailed user information."""
        response = self.session.get(f"{self.BASE_URL}/me")

        # Print request
        print("REQUEST")
        print(response.request.url)
        print(response.request.headers)
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
        return response.json().get("value", [])


def index(request: HttpRequest):
    access_token = request.session.get("oidc_access_token")

    try:
        graph = GraphClient(access_token)
        user_info = graph.get_user_info()
    except Exception as e:
        print(e)
        user_info = None

    return render(
        request,
        "account.html",
        {"request": request, "settings": settings, "user_info": user_info},
    )
