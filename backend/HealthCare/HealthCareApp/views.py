from django.shortcuts import render,redirect
from django.http import HttpResponse

from functools import wraps
from .serializer import DoctorSerializer,PatientSerializer
from rest_framework.decorators import api_view
from django.core import serializers

from django.http import JsonResponse
import json

from django.contrib.auth.hashers import make_password

from .models import Doctor,Patient



def custom_login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        
        if not request.session.get('is_Authenticated', False):
            return   JsonResponse({"message":"User is not authenticated"},status=401) 
        return view_func(request, *args, **kwargs)
    return _wrapped_view





@api_view(['POST'])
def Doctor_Register(request):
    
    

    data=json.loads(request.body)
    print(data)
    print("*"*10)
    print (f"{data.get('email')} , {data.get('phone_no')}, {data.get('location')},{data.get('password')}")
    if 'password' in data:
            data['password'] = make_password(data.get('password'))

    serialize=DoctorSerializer(data=data)
    if (serialize.is_valid()):
        serialize.save()
        return JsonResponse(serialize.data, status=201)

  
    return JsonResponse(serialize.errors, status=400)
    


@api_view(['POST'])
def Patient_Register(request):
  
    data=json.loads(request.body)
    print (f"{data.get('email')} , {data.get('phone_no')}, {data.get('location')},{data.get('password')}")
    if 'password' in data:
            data['password'] = make_password(data.get('password'))

    serialize=PatientSerializer(data=data)
    if (serialize.is_valid()):
        serialize.save()
        return JsonResponse(serialize.data, status=201)

  
    return JsonResponse(serialize.errors, status=400)


@api_view(['POST'])
def Login(request):
    
    try :
        data=json.loads(request.body)
        print(f"{data.get('email')},{data.get('password')},{data.get('role')}")
        password=data.get("password")
        email=data.get("email")

        if data.get('role')=='doctor':
            doc=Doctor.objects.get(email=email)
            if doc.check_password(password):
                request.session['email']=email
                request.session['id']=doc.did
                request.session['location']=doc.location
                request.session['name']=doc.name
                request.session['role']='doctor'
                request.session['is_Authenticated']=True                

                return   JsonResponse({"Success":"Success"},status=200)

            else :
                return JsonResponse({"error":"Invalid Password Or Email"},status=401)
        else :
            patient=Patient.objects.get(email=email)
            if patient.check_password(password):
                request.session['email']=email
                request.session['id']=patient.pid
                request.session['location']=patient.location
                request.session['name']=patient.name
                request.session['role']='patient'
                request.session['is_Authenticated']=True


                return   JsonResponse({"Success":"Success"},status=200)


            else :
                return JsonResponse({"error":"Invalid Password Or Email"},status=401)

    except Exception as e:
        return JsonResponse({"erorr":e},status=500)


