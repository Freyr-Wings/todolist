from django.db import models

# Create your models here.
from django.utils import timezone


class Todolist(models.Model):
    content = models.CharField(max_length=512)
    priority = models.IntegerField()
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField()
    finished = models.BooleanField()
