from django.urls import path
from .views import ChatSSE

urlpatterns = [
    path('chat/', ChatSSE.as_view(), name='chat_sse'),
]