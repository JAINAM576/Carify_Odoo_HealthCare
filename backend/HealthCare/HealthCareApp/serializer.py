
from rest_framework import serializers
from .models import Doctor,Patient

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['name', 'phone_no', 'location', 'experience', 'speciality', 'email','password']


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['name', 'phone_no', 'location', 'age', 'gender', 'email','password']
