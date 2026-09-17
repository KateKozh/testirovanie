document.addEventListener("DOMContentLoaded", function () {
    const regBtn = document.getElementById("regBtn");
    const adminBtn = document.getElementById("adminBtn");
    const captchaBlock = document.getElementById("captchaBlock");
    const captcha = document.getElementById("captcha");
    const captchaInput = document.getElementById("captchaInput");
    const captchaNumBlock = document.getElementById("captchaNumBlock");
    const captchaNum = document.getElementById("captchaNum");
    const captchaNumInput = document.getElementById("captchaNumInput");
    const captchaMessage = document.getElementById("captchaMessage");

    let sum = 0;

    // Генерация буквенной капчи
    function generateCap() {
        const symbols = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm0123456789";
        let text = "";
        for (let i = 0; i < 5; i++) {
            text += symbols[Math.floor(Math.random() * symbols.length)];
        }
        captcha.textContent = text;
        console.log("Капча: ", text);
    }

    // Генерация числовой капчи
    function generateCapNum() {
        const a = Math.floor(Math.random() * 10 + 1);
        const b = Math.floor(Math.random() * 10 + 1);
        sum = a + b;
        captchaNum.textContent = `${a} + ${b} = ?`;
        console.log("Капча-число: ", sum);
    }

    // Инициализация капчи при загрузке
    generateCap();

    function isEmpty(str) {
        return !str || str.trim() === "";
    }

    //обработка ввода буквенной капчи
    captchaInput.addEventListener("input", () => {
        if (isEmpty(captchaInput.value)) {
            captchaMessage.textContent = "Поле должно быть заполнено";
            captchaMessage.className = "";
            return;
        }
        
        if (captchaInput.value.length === 5) {
            if (captchaInput.value === captcha.textContent) {
                captchaMessage.textContent = "Правильно! Можно зарегистрироваться)";
                captchaMessage.className = "correct";
                regBtn.disabled = false;
            } else {
                captchaMessage.textContent = "Неверно. Попробуйте решить пример";
                captchaMessage.className = "";
                captchaBlock.style.display = "none";
                captchaNumBlock.style.display = "block";
                generateCapNum();
            }
        }
    });

    //обработка ввода числовой капчи
    captchaNumInput.addEventListener("input", () => {
        if (isEmpty(captchaNumInput.value)) {
            captchaMessage.textContent = "Поле должно быть заполнено";
            captchaMessage.className = "";
            return;
        }
        
        const userAnswer = parseInt(captchaNumInput.value);
        if (!isNaN(userAnswer) && userAnswer === sum) {
            captchaMessage.textContent = "Правильно! Можно зарегистрироваться)";
            captchaMessage.className = "correct";
            regBtn.disabled = false;
        } else {
            captchaMessage.textContent = "Неверно. Попробуйте еще раз";
            captchaMessage.className = "";
        }
    });

    //обработка кнопки регистрации
    regBtn.addEventListener("click", () => {
        const answer = prompt("Хотите пройти регистрацию? Да/Нет");
        if (answer == null) {
            alert("Отмена");
            return;
        }

        const clean = answer.trim().toLowerCase();
        if (clean == "да") {
            alert("Регистрация прошла успешно!");
        } else {
            alert("Попробуйте ещё раз");
        }
    });


   
});