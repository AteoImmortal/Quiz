// Обёект с сохранёнными ответами
const answers = {
    2: null,
    3: null,
    4: null,
    5: null
}

// Движение вперёд
const btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button) {
    button.addEventListener("click", function() {
        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card);

        if (thisCard.dataset.validate == "novalidate") {
            navigate("next", thisCard);
            updataProgressBar("next", thisCardNumber);

        } else {
            // При движении вперед сохраняем данные в объект
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

            // Вадидация на заполненность
            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate("next", thisCard);
                updataProgressBar("next", thisCardNumber);
            } else {
                alert("Сделай ответ!");
            }

        }
    });
});


// Движение назад
const btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button) {
    button.addEventListener("click", function() {
        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card);
        
        navigate('prev', thisCard);
        updataProgressBar("prev", thisCardNumber);
    });
});

// Навигация
function navigate(direction, thisCard) {
    let thisCardNumber = parseInt(thisCard.dataset.card);
    let nextCard;

    if (direction == "next") {
        nextCard = thisCardNumber + 1;
    } else if (direction == "prev") {
        nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add("hidden");
    document
        .querySelector(`[data-card="${nextCard}"]`)
        .classList.remove("hidden");
}


// Функция сбора заполненных данных с карточки
function gatherCardData(number) {
    let question;
    let result = [];

    // Находим карточку по номеру и data-атрибуту
    const currentCard = document.querySelector(`[data-card="${number}"]`);

    // Находим главный вопрос карточки
    question = currentCard.querySelector("[data-question]").innerText;

    // Находим все заполненные значения из радио кнопок
    const radioValues = currentCard.querySelectorAll('[type="radio"]');
    radioValues.forEach(function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    // Находим все заполненные значения из чекбоксов
    const checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function(item){
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    })

    // Находим все заполненные значения из инпутов
    const inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    inputValues.forEach(function(item){
        itemValue = item.value;
        if ( itemValue.trim() != "" ) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    })

    const data = {
        question: question,
        answer: result
    };

    return data;
}


// Функция записи ответа в объект с ответами
function saveAnswer(number, data){
    answers[number] = data;
}

   
// Функция проверки на заполненность 
function isFilled(number){
    if (answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Функция для проверки email
function validateEmail(email) {
    let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}


// Проверка на заполненость required чекбоксов и инпутов с email
function checkOnRequired(number) {
    const currentCard = document.querySelector(`[data-card="${number}"]`);
    const requiredFields = currentCard.querySelectorAll('[required]');

    let isValidArray = [];

    requiredFields.forEach(function(item) {
        if(item.type == "checkbox" && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == "email") {
            if(validateEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false;
    }
}

// Подсвечиваем рамку у радиокнопок
document.querySelectorAll('.radio-group').forEach(function(item) {
    item.addEventListener('click', function(event) {

        // Проверяем где произошёл клик - внитри тега label или нет
        const label = event.target.closest('label');
        if (label) {
            // Отменяем активный класс у всех тегов label
            label.closest('.radio-group').querySelectorAll('label').forEach(function(item) {
                item.classList.remove('radio-block--active');
            })

            // Добавляем активный класс
            label.classList.add('radio-block--active');
        }
    })
})

// Подсвечиваем рамкку для чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item) {
    item.addEventListener('change', function(){
        if (item.checked) {
            // Добавляем класс
            item.closest('label').classList.add('checkbox-block--active');
        } else {
            // Убираем класс
            item.closest('label').classList.remove('checkbox-block--active');
        }
    })
})



// Отображение прогресс бара
function updataProgressBar(direction, cardNumber){

    // Рассчёт всего кол-ва карточек
    let cardsTotalNumber = document.querySelectorAll('[data-card]').length;

    // Текущая карточка
    if (direction == 'next'){
        cardNumber = cardNumber + 1;
    } else if (direction == 'prev') {
        cardNumber = cardNumber - 1;
    }

    // Расчёт % прохождения 
    let progress = ((cardNumber * 100) / cardsTotalNumber).toFixed();
    
    // Обновляем прогресс бар

    const progressBar = document
    .querySelector(`[data-card="${cardNumber}"]`)
    .querySelector(".progress");
    if(progressBar) {
        
        // Обновить число прогресс бара
        progressBar.querySelector(
            ".progress__label strong"
        ).innerText = `${progress}%`;

        // Обновить полоску прогресс бара
        progressBar.querySelector(
            ".progress__line-bar"
        ).style = `width: ${progress}%`;
    }
}