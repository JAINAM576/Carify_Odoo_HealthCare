
from django.urls import path
from .views import Doctor_Register,Patient_Register,Login
urlpatterns = [
    path("Doctor_Register/",Doctor_Register,name="Doctor_Register"),
    path("Patient_Register/",Patient_Register,name="Patient_Register"),
    path("Login/",Login,name="Login"),
]
