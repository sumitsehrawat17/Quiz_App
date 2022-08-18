const url = window.location.href
const quizBox = document.getElementById("quiz-box")
const timerBox = document.getElementById('timer-box')

const activateTimer = (time) =>{

    if (time.toString().length <  2){
        timerBox.innerHTML = `
        <b>0${time}:00<b>
        `
    }
    else{
        timerBox.innerHTML += `
        <b>${time}:00<b>
        `
    }
    let minutes = time-1
    let second = 60
    let displaySeconds
    let displayMinutes
    const timer = setInterval(() => {
        second--
        if (second < 0) {
            second = 59
            minutes--
        }
        if (minutes.toString().length < 2) {
            displayMinutes = '0' + minutes
        } else {
            displayMinutes = minutes
        }
        if (second.toString().length < 2) {
            displaySeconds = '0' + second
        } else {
            displaySeconds = second
        }
        if (minutes === 0 && second === 0) {
            timerBox.innerHTML = `<b class = 'text-muted'>00:00</b>`
            setTimeout(() => {
                alert("Time Up!")
                clearInterval(timer)
                sendData()
            })
        }
        timerBox.innerHTML = `<b class = 'text-muted'> ${displayMinutes}:${displaySeconds}</b>`
    }, 1000);

    document.getElementById("end-test").addEventListener("click", () => stop(timer))
}
function stop(timer) {
    timerBox.innerHTML = `<b class = 'text-muted'> 00:00</b>`
    clearInterval(timer)
}



$.ajax({
    type: 'GET',
    url: `${url}data`,
    success: function (response){

        const data = response.data

        data.forEach(el => {
          for (const [question, answer] of Object.entries(el)) {

              quizBox.innerHTML +=`
              <div class="mb-2">
              <hr>
              <b>${question}</b>
              </div>
              `
              answer.forEach(answer=>{
                  quizBox.innerHTML += `
                  <div>
                  <input type="radio" class="ans" id="${question}-${answer}" value="${answer}" name="${question}">
                  <label for="${question}">${answer}</label>
                  </div>
                  `
              })
          }
        });
        activateTimer(response.time)
    },
    error: function (error){
        console.log(error)
    }
})


const quizForm = document.getElementById('quiz-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')


const sendData = () =>{

    const elements = [...document.getElementsByClassName('ans')]
    const data = {}
    data['csrfmiddlewaretoken'] = csrf[0].value
    elements.forEach(el =>{
        if (el.checked){
            data[el.name] = el.value

        }else{
            if (!data[el.name]){
                data[el.name] = null
            }
        }
    })
    $.ajax({
        type: 'POST',
        url: `${url}save/`,
        data: data,
        success: function(response) {
            const passed = response['passed']
            const score = response['score']
            quizForm.classList.add('not-visible')
            const resDiv = document.createElement('div')
            if (passed){
                resDiv.innerHTML += `
                <div class="jumbotron ">
                  <h3 class="display-4">Congratulations you passed the quiz! </h3>
                  <p class="lead">Your score is ${score}% </p>
                  <hr class="my-4">
                  <a class="btn btn-primary btn-lg" onclick="location.href='{% url main-view %}'" role="button">Play Again</a>
                </div>
                `
            }
            else {
                resDiv.innerHTML += `
                    <div class="jumbotron" >
                    <div class="container mt-3">
                          <h3 class="display-4">Sorry, you failed the test !</h3>
                          <p class="lead">Your score is ${score}% </p>
                          <hr class="my-4">
                          <a class="btn btn-primary" href="#" role="button">Play Again</a>
                    </div>
                </div>
                `
            }
            const body = document.getElementsByTagName('BODY')[0]
            body.append(resDiv)
        },
        error: function (error){
            console.log(error)
        }
    })
}

quizForm.addEventListener('submit', e=>{
    e.preventDefault()
    sendData()
})


