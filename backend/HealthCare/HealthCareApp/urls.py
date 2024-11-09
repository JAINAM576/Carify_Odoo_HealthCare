
from django.urls import path
from .views import Doctor_Register,Patient_Register,Login,getInfo,logout,get_response,getSlots,reportAnalyze
urlpatterns = [
    path("Doctor_Register/",Doctor_Register,name="Doctor_Register"),
    path("Patient_Register/",Patient_Register,name="Patient_Register"),
    path("Login/",Login,name="Login"),
    path("getInfo/",getInfo,name="getInfo"),
    path("logout/",logout,name="logout"),
    path("chatResponse/",get_response,name="chatResponse"),
    path("getSlots/",getSlots,name="getSlots"),
    path("reportAnalyze/",reportAnalyze,name="reportAnalyze"),






]
