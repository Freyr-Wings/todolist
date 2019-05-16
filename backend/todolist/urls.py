from django.conf.urls import include, url
from rest_framework.routers import DefaultRouter

from todolist.views import TodolistViewSet

router = DefaultRouter()
router.register(r'items', TodolistViewSet)
urlpatterns = router.urls
