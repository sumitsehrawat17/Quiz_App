from django.urls import path
from .views import QuizListView, quiz_view, quiz_data_view, save_quiz_view, index, register_view, login_view, logout_view


app_name = 'quizes'

urlpatterns = [
    path('', index, name='index-view'),
    path('login/', login_view, name='login-view'),
    path('logout/', logout_view, name='logout-view'),
    path('register/', register_view, name='register-view'),
    # path('leaderboard/', leaderboard_view, name='leaderboard-view'),
    path('quiz/', QuizListView.as_view(), name='main-view'),
    path('quiz/<pk>/', quiz_view, name='quiz-view'),
    path('quiz/<pk>/data/', quiz_data_view, name='quiz-data-view'),
    path('quiz/<pk>/save/', save_quiz_view, name='save-quiz-view'),
]
