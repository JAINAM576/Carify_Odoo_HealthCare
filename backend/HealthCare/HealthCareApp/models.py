from djongo import models
import datetime
from django.contrib.auth.hashers import check_password

class Doctor(models.Model):
    did = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    phone_no = models.BigIntegerField()
    location = models.CharField(max_length=255)  
    experience = models.IntegerField() 
    speciality = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password=models.CharField(max_length=255,default="")

    def __str__(self):
        return f"{self.name}-{self.email}"
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)



class Patient(models.Model):
    pid = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    phone_no = models.BigIntegerField()
    location = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)  
    email = models.EmailField(unique=True)
    password=models.CharField(max_length=255,default="")

    def __str__(self):
        return f"{self.name}-{self.email}"
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)


class Slot(models.Model):
    sid = models.AutoField(primary_key=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    slot_no = models.IntegerField()
    time_range = models.CharField(max_length=255)  
    max_patient = models.IntegerField(default=5)
    status = models.BooleanField(default=True)  

    def __str__(self):
        return f"{self.sid} Slot {self.slot_no} for Dr. {self.doctor.email}"


class AvailableSlot(models.Model):
    sid = models.ForeignKey(Slot, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    available = models.BooleanField(default=True)
    date = models.DateField(default=datetime.date.today)

    def __str__(self):
        return f"Available Slot on {self.date} for Dr. {self.doctor.name}"


class PatientBooking(models.Model):
    STATUS_CHOICES = [
        ('cancel', 'Canceled'),
        ('appointed', 'Appointed'),
        ('rejected', 'Rejected'),
    ]
    
    did = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    pid = models.ForeignKey(Patient, on_delete=models.CASCADE)
    sid = models.ForeignKey(Slot, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return f"Booking for {self.pid.name} with Dr. {self.did.name} on {self.date}"


class Report(models.Model):
    pid = models.ForeignKey(Patient, on_delete=models.CASCADE)
    did = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    link = models.URLField()  
    def __str__(self):
        return f"Report for {self.pid.name} by Dr. {self.did.name}"
