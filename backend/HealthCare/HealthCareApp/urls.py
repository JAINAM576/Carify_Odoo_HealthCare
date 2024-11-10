
from django.urls import path
from .views import Doctor_Register,Patient_Register,Login,getInfo,logout,get_response,getSlots,reportAnalyze,checkAvailibility,insertPatient,getProfileInfo,add_slot,getSlotsCount
urlpatterns = [
    path("Doctor_Register/",Doctor_Register,name="Doctor_Register"),
    path("Patient_Register/",Patient_Register,name="Patient_Register"),
    path("Login/",Login,name="Login"),
    path("getInfo/",getInfo,name="getInfo"),
    path("logout/",logout,name="logout"),
    path("chatResponse/",get_response,name="chatResponse"),
    path("getSlots/",getSlots,name="getSlots"),
    path("reportAnalyze/",reportAnalyze,name="reportAnalyze"),
    path("checkAvailibility/",checkAvailibility,name="checkAvailibility"),
    path("insertPatient/",insertPatient,name="insertPatient"),
    path("getProfileInfo/",getProfileInfo,name="getProfileInfo"),

    path('slots/', add_slot, name='add_slot'),  
    path('getSlotsCount/', getSlotsCount, name='getSlotsCount'),  








]
