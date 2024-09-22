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
    pdf_path = static('pdfs/Indian_Constitution_Urdu_Material_page-0001.pdf')
    print(pdf_path)
    context = {
        'indian_constitution_pdf': pdf_path,
    }
    return render(request, 'urdu_political_science_paper_2.html', context)
