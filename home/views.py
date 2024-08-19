from django.shortcuts import render
from django.shortcuts import HttpResponse

def home_page(request):
    return render(request,'home.html')

def services_page(request):
    return render(request, 'services.html')

def contact_page(request):
    return render(request, 'contact.html')

def media_page(request):
    return render(request, 'media.html')