from .models import Quiz
from django.views.generic import ListView
from django.http import JsonResponse
from questions.models import Question, Answer
from results.models import Result
from django.shortcuts import render, redirect
from .forms import CreateUserForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required


class QuizListView(ListView):
    model = Quiz
    template_name = 'quizes/main.html'


def index(request):
    return render(request, 'quizes/home.html')


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('/quiz')
        else:
            messages.info(request, "Please enter correct details !")

    return render(request, 'quizes/login.html')


def register_view(request):
    form = CreateUserForm(request.POST)
    if form.is_valid():
        form.save()
        user = form.cleaned_data.get('username')
        messages.success(request, "Account was successfully created for" + user)
        return redirect('/login')

    return render(request, 'quizes/register.html', {'form': form})


def logout_view(request):

    logout(request)
    return redirect('/login')


# def leaderboard_view(request):
#
#     top_quiz_profiles = Result.objects.order_by('-score')[:5]
#     total_count = top_quiz_profiles.count()
#     context = {
#         'top_quiz_profiles': top_quiz_profiles,
#         'total_count': total_count,
#     }
#     print(top_quiz_profiles)
#     return render(request, 'quizes/leaderboard.html', context=context)


@login_required(login_url='quizes/login.html')
def quiz_view(request, pk):
    quiz = Quiz.objects.get(pk=pk)
    return render(request, 'quizes/quiz.html', {'obj': quiz})


@login_required(login_url='quizes/login.html')
def quiz_data_view(request, pk):
    quiz = Quiz.objects.get(pk=pk)
    questions = []
    for q in quiz.get_questions():
        answer = []
        for ans in q.get_answers():
            answer.append(ans.text)
        questions.append({str(q): answer})
        if len(questions) == quiz.number_of_questions:
            break
    return JsonResponse({'data': questions, 'time': quiz.time})


def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


@login_required(login_url='quizes/login.html')
def save_quiz_view(request, pk):
    if is_ajax(request):
        data = request.POST
        data_ = dict(data.lists())
        data_.pop('csrfmiddlewaretoken')
        questions = []
        for k in data_.keys():
            question = Question.objects.get(text=k)
            questions.append(question)

        user = request.user
        quiz = Quiz.objects.get(pk=pk)
        score = 0
        results = []
        correct_answer = None
        for q in questions:
            a_selected = request.POST.get(q.text)
            question_answer = Answer.objects.filter(question=q)
            for a in question_answer:
                if a.correct:
                    correct_answer = a.text
                    if a_selected == a.text:
                        score += 1
            results.append({str(q): {'correct_answer': correct_answer, 'answered': a_selected}})

        score *= (100 / quiz.number_of_questions)

        Result.objects.create(quiz=quiz, user=user, score=score)

        # x = Result.objects.order_by('-score')[:5]
        # for ele in x:
        #     print(ele.user.username)

        if score >= quiz.required_score_to_pass:
            return JsonResponse({'passed': True, 'score': score, 'results': results})
        else:
            return JsonResponse({'passed': False, 'score': score, 'results': results})
