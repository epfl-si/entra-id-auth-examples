from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.conf import settings


def account_login(request):

    if request.user.is_authenticated:
        return redirect("/polls")

    return render(
        request,
        "login.html",
        {"request": request, "settings": settings},
    )
