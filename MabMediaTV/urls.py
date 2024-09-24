"""
URL configuration for MabMediaTV project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from home import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.home_page , name="home_page"),
    path('services',views.services_page,name="services_page"),
    path('contact',views.contact_page,name="contact_page"),
    path('media',views.media_page,name="media_page"),

    path('urdu/political-science',views.urdu_political_science,name="urdu_political_science"),
    path('urdu/political-science/paper-2',views.urdu_political_science_paper_2,name="urdu_political_science_paper_2"),
    path('urdu/political-science/paper-3',views.urdu_political_science_paper_3,name="urdu_political_science_paper_3"),
]
