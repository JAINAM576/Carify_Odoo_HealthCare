from django.contrib import admin
from .models import Doctor, Patient, Slot, AvailableSlot, PatientBooking, Report

admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(Slot)
admin.site.register(AvailableSlot)
admin.site.register(PatientBooking)
admin.site.register(Report)
