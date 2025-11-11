const display = document.querySelector('#display');
const buttons = document.querySelector('#buttons');

// 2. SUAS VARIÁVEIS DE ESTADO (com uma adição)
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let shouldResetDisplay = false; 

function updateDisplay() {
    display.value = displayValue.replace('.', ',');
}
updateDisplay();

buttons.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.matches('.btn')) {
        return;
    }

    const value = target.dataset.value;

    if (value !== '=' && value !== '.' && !Number.isInteger(parseFloat(value))) {
         shouldResetDisplay = false;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
            handleOperator(value);
            break;
        case '=':
            handleEquals();
            break;
        case '.':
            inputDecimal();
            break;
        case 'C':
            clearCalculator();
            break;
        case 'negate':
            negateValue();
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }
    updateDisplay();
});

function inputDigit(digit) {
    if (waitingForSecondOperand || shouldResetDisplay) {
        displayValue = digit;
        waitingForSecondOperand = false;
        shouldResetDisplay = false; 
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal() {
    if (shouldResetDisplay) {
        displayValue = '0.';
        shouldResetDisplay = false;
        return;
    }
    if (waitingForSecondOperand) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        return;
    }
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation();
        displayValue = String(result);
        firstOperand = result;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
    shouldResetDisplay = false; 
}

function performCalculation() {
    if (operator === null || waitingForSecondOperand) return firstOperand;

    const secondOperand = parseFloat(displayValue);
    if (isNaN(secondOperand)) return firstOperand;

    let result = 0;
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            if (secondOperand === 0) {
                alert('Erro: Divisão por zero!');
                clearCalculator();
                return 0;
            }
            result = firstOperand / secondOperand;
            break;
        case '%':
            if (secondOperand === 0) {
                alert('Erro: Divisão por zero (módulo)!');
                clearCalculator();
                return 0;
            }
            result = firstOperand % secondOperand;
            break;
    }
    return parseFloat(result.toPrecision(15));
}

function handleEquals() {
    if (!operator || waitingForSecondOperand) return; 
    const result = performCalculation();
    displayValue = String(result);
    firstOperand = null; 
    operator = null;
    waitingForSecondOperand = false;
    shouldResetDisplay = true; 
}

function clearCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    shouldResetDisplay = false;
}

function negateValue() {
    if (displayValue === '0' || shouldResetDisplay) return;
    displayValue = String(parseFloat(displayValue) * -1);
}