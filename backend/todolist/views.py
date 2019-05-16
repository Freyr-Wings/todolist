from rest_framework import mixins, viewsets


# Create your views here.
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from todolist.models import Todolist
from serializers import TodolistSerializer


# custom pagination
# https://stackoverflow.com/questions/40985248/django-api-framework-getting-total-pages-available
class ResultsSetPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'item_count': self.page_size,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })


def todolist_with_order(request):
    pass


class TodolistViewSet(mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Todolist.objects.all()
    serializer_class = TodolistSerializer
    pagination_class = ResultsSetPagination

    def list(self, request, *args, **kwargs):
        order = int(request.query_params["order"])
        origin_queryset = self.get_queryset()

        if order == 1:
            origin_queryset = origin_queryset.order_by("priority")
        elif order == 2:
            origin_queryset = origin_queryset.order_by("priority").reverse()
        elif order == 3:
            origin_queryset = origin_queryset.order_by("id").reverse()
        elif order == 5:
            origin_queryset = origin_queryset.order_by("end_time")

        queryset = self.filter_queryset(origin_queryset)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)