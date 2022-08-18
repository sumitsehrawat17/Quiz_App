const modalBtns = [...document.getElementsByClassName('modal-button')]
const modalBody = document.getElementById('modal-body-confirm')
const startBtn = document.getElementById('start-button')
const url = window.location.href

modalBtns.forEach(modalBtn=> modalBtn.addEventListener('click', ()=>{

    const pk = modalBtn.getAttribute('data-pk')
    const number_of_questions = modalBtn.getAttribute('data-questions')
    const difficulty = modalBtn.getAttribute('data-difficulty')
    const pass = modalBtn.getAttribute('data-pass')
    const time = modalBtn.getAttribute('data-time')

    modalBody.innerHTML =`
        <div class="h5 mb-3"> Are you sure you want to begin ?</div>
        <div class="text-muted">
            <ul>
                <li><b>Difficulty:</b> ${difficulty}</li>
                <li><b>Number of Questions: </b> ${number_of_questions}</li>
                <li><b>Passing Number: </b> ${pass} %</li>
                <li><b>Time : </b> ${time} Min</li>
            </ul>
        </div>`
    startBtn.addEventListener('click', ()=>{
        window.location.href = url + pk
    })
}))
