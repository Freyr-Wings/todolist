from rest_framework import serializers

from todolist.models import Todolist


class TodolistSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    content = serializers.CharField()
    priority = serializers.ChoiceField(choices=xrange(10))
    start_time = serializers.DateTimeField(read_only=True, format='%Y/%m/%d')
    end_time = serializers.DateTimeField(input_formats=['%Y/%m/%d', ], format='%Y/%m/%d')
    finished = serializers.BooleanField(default=False)

    class Meta:
        model = Todolist
        fields = ('id',
                  'content',
                  'priority',
                  'start_time',
                  'end_time',
                  'finished')
