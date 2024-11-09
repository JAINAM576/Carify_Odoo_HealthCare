from django.shortcuts import render,redirect
from django.http import HttpResponse

from functools import wraps
from .serializer import DoctorSerializer,PatientSerializer
from rest_framework.decorators import api_view
from django.core import serializers

from django.http import JsonResponse
import json

from django.contrib.auth.hashers import make_password

from .models import Doctor,Patient,Slot,AvailableSlot





from django.views.decorators.csrf import csrf_exempt
from .utils import setup_gemini, get_bot_response


import fitz  
import numpy as np
from PIL import Image
import io



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



# GETTING  INFORMATION FOR PATIENT OR DOCTOR 

@api_view(['GET'])
@custom_login_required
def getInfo(request):
  try :
    id=request.session.get("id")
    role=request.session.get("role")
    is_Auth=request.session.get("is_Authenticated")
    print(f"{id},{role}, {is_Auth}")
    if role=='doctor':
        patient=Patient.objects.values()
        print(patient,"doctor")

        patient_data =  list(patient)  
        return JsonResponse(patient_data, status=200,safe=False)
    else :
        doctor=Doctor.objects.values()
        
        print(doctor,"doctor")
        doctor_data =list(doctor)


        return JsonResponse(doctor_data, status=200,safe=False)
    
  except Patient.DoesNotExist:
        return JsonResponse({"error": "Patient not found."}, status=404)

  except Doctor.DoesNotExist:
        return JsonResponse({"error": "Doctor not found."}, status=404)

  except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    
# for chatbot resposne

@csrf_exempt
@custom_login_required
def get_response(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_input = data.get('message', '')
            
            # Get bot response
            model = setup_gemini()
            bot_response = get_bot_response(model, user_input)
            
            return JsonResponse({
                'status': 'success',
                'response': bot_response
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })
    
    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    })



# for getting slots
@custom_login_required
@api_view(['POST'])

def getSlots(request):
    try :
        data=json.loads(request.body)
        fields=Slot.objects.filter(doctor_id=data.get("doctorId")).values_list('slot_no','sid','time_range')
        print(list(fields),"list")
        return JsonResponse({"data":list(fields)},status=200)

    except Exception as e:
        return JsonResponse({"error":e},status=400)


@api_view(['POST'])
@custom_login_required

@custom_login_required
def checkAvailibility(request):
    try:
        # Extract the data from the request
        doctor_id = request.data.get("doctorId")
        date = request.data.get("date")
        sid_array = request.data.get("sidArray")

        # Check if there are any slots for the given date
        slots_for_date = AvailableSlot.objects.filter(date=date)
        if not slots_for_date.exists():
            return JsonResponse({"error": "No slots found for the given date"}, status=404)

        # Filter slots by the doctor ID
        slots_for_doctor = slots_for_date.filter(doctor_id=doctor_id)
        if not slots_for_doctor.exists():
            return JsonResponse({"error": "No slots found for the given doctor on the specified date"}, status=404)

        # Create a dictionary for the response
        availability_dict = {}

        # Check each sid in sidArray for availability
        for sid in sid_array:
            # Find the slot for the given `sid` and doctor
            slot = slots_for_doctor.filter(sid_id=sid).first()
            if slot:
                # Add the availability of this slot to the dictionary
                availability_dict[sid] = slot.available
            else:
                # If sid is not found, mark it as unavailable or False
                availability_dict[sid] = False

        return JsonResponse(availability_dict)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# for report analysis
def pdf_to_images(pdf_file):
    """Convert PDF to images using PyMuPDF"""
    try:
        # Read PDF content
        pdf_bytes = pdf_file.read()
        
        # Open PDF document
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        images = []
        
        # Process each page
        for page_num in range(pdf_document.page_count):
            page = pdf_document[page_num]
            # Convert to image (300 DPI for good quality)
            pix = page.get_pixmap(matrix=fitz.Matrix(300/72, 300/72))
            
            # Convert to PIL Image
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            images.append(img)
        
        pdf_document.close()
        return images
        
    except Exception as e:
        raise Exception(f"Error processing PDF: {str(e)}")

def get_gemini_response(model, images, language):
    """Get consolidated analysis from Gemini for all images"""
    try:
        # Convert all images to byte arrays
        image_parts = []
        for image in images:
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            image_parts.append({
                "mime_type": "image/png",
                "data": img_byte_arr.getvalue()
            })
        
        prompt = f"""
        Summarize the following medical report in {language} in a clear, concise and easy-to-understand way:

        Please analyze these medical report images and provide a simplified summary that a non-medical expert can understand.
        Focus on:
        1. Main medical issues or concerns
        2. Key findings from tests and examinations
        3. Treatment plan and next steps
        4. Important follow-up actions
        5. Use simple, plain language without technical terms

        Provide the response in this JSON format:
        {{
            "test_results": {{
                "key_findings": [
                    "List main test results in simple terms",
                    "Explain what each result means for health"
                ],
                "abnormal_values": [
                    "List any concerning results",
                    "Explain why they are important"
                ],
                "normal_values": [
                    "List healthy/normal results",
                    "Explain what's good about them"
                ]
            }},
            "health_assessment": {{
                "overall_status": "Simple explanation of overall health status",
                "areas_of_concern": [
                    "List main health concerns in simple terms",
                    "Explain why each is important"
                ],
                "positive_indicators": [
                    "List good health indicators",
                    "Explain why they're positive"
                ]
            }},
            "recommendations": {{
                "immediate_actions": [
                    "List urgent steps to take",
                    "Explain why they're important"
                ],
                "follow_up_tests": [
                    "List recommended future tests",
                    "Explain why they're needed"
                ],
                "lifestyle_changes": [
                    "List suggested lifestyle improvements",
                    "Explain how they will help"
                ]
            }},
            "summary": "A brief, simple explanation of the overall report in 2-3 sentences"
        }}
        """

        # Process each image and combine results
        responses = []
        for image_part in image_parts:
            try:
                response = model.generate_content([prompt, image_part])
                try:
                    json_response = json.loads(response.text)
                    responses.append(json_response)
                except json.JSONDecodeError:
                    cleaned_response = response.text.strip()
                    if cleaned_response.startswith("```json"):
                        cleaned_response = cleaned_response[7:-3]
                    responses.append(json.loads(cleaned_response))
            except Exception as e:
                continue

        # Combine all responses into a single analysis
        combined_analysis = combine_analyses(responses)
        return combined_analysis

    except Exception as e:
        raise Exception(f"Error in Gemini analysis: {str(e)}")

def combine_analyses(responses):
    """Combine multiple analyses into one comprehensive report"""
    combined = {
        "test_results": {
            "key_findings": [],
            "abnormal_values": [],
            "normal_values": []
        },
        "health_assessment": {
            "overall_status": "",
            "areas_of_concern": [],
            "positive_indicators": []
        },
        "recommendations": {
            "immediate_actions": [],
            "follow_up_tests": [],
            "lifestyle_changes": []
        },
        "summary": ""
    }

    for response in responses:
        if not response:
            continue

        # Combine test results
        for category in ["key_findings", "abnormal_values", "normal_values"]:
            combined["test_results"][category].extend(
                response.get("test_results", {}).get(category, [])
            )

        # Update health assessment
        assessment = response.get("health_assessment", {})
        if assessment.get("overall_status"):
            combined["health_assessment"]["overall_status"] = assessment["overall_status"]
        combined["health_assessment"]["areas_of_concern"].extend(
            assessment.get("areas_of_concern", [])
        )
        combined["health_assessment"]["positive_indicators"].extend(
            assessment.get("positive_indicators", [])
        )

        # Combine recommendations
        for category in ["immediate_actions", "follow_up_tests", "lifestyle_changes"]:
            combined["recommendations"][category].extend(
                response.get("recommendations", {}).get(category, [])
            )

    # Remove duplicates while preserving order
    for category in combined["test_results"]:
        combined["test_results"][category] = list(dict.fromkeys(
            combined["test_results"][category]
        ))
    for category in combined["health_assessment"]:
        if isinstance(combined["health_assessment"][category], list):
            combined["health_assessment"][category] = list(dict.fromkeys(
                combined["health_assessment"][category]
            ))
    for category in combined["recommendations"]:
        combined["recommendations"][category] = list(dict.fromkeys(
            combined["recommendations"][category]
        ))

    combined["summary"] = response['summary']
    
    return combined

@csrf_exempt
@api_view(['POST'])
def reportAnalyze(request):
    """Django view function for medical report analysis"""
  
    
    if request.method == 'POST':
        try:
            # Get the PDF file and language from the request
            pdf_file = request.FILES.get('pdf_file')
            language =  'English'
            
            if not pdf_file:
                return JsonResponse({'error': 'No PDF file provided'}, status=400)
            
           
            model = setup_gemini("gemini-1.5-flash")
            
            # Convert PDF to images
            images = pdf_to_images(pdf_file)
            
            # Get analysis from Gemini
            analysis = get_gemini_response(model, images, language)
            
            return JsonResponse({
                'success': True,
                'analysis': analysis
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)

# for logout and flush session 

def logout(request):
    request.session.flush()  # Clears the entire session
    return JsonResponse({"message": "Logged out successfully"}, status=200)