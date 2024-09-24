from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.templatetags.static import static
import os

def home_page(request):
    return render(request,'home.html')

def services_page(request):
    return render(request, 'services.html')

def contact_page(request):
    return render(request, 'contact.html')

def media_page(request):
    return render(request, 'media.html')

def urdu_political_science(request):
    return render(request, 'urdu_political_science.html')

def urdu_political_science_paper_2(request):
    indian_constitution_pdf = static('pdfs/Indian_Constitution_Urdu_Material.pdf')
    context = {
        'indian_constitution_pdf': indian_constitution_pdf,
    }
    return render(request, 'urdu_political_science_paper_2.html', context)

def urdu_political_science_paper_3(request):
    personnel_administration_pdf = static('pdfs/Personnel_Administration_Urdu_Material.pdf')
    office_management_pdf = static('pdfs/Office_Management_Urdu_Material.pdf')
    context = {
        'personnel_administration_pdf' : personnel_administration_pdf,
        'office_management_pdf' : office_management_pdf,
    }
    return render(request, 'urdu_political_science_paper_3.html', context)
