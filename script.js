    let displayValue = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false; 

    function updateDisplay() {
        display.value = displayValue.toLocaleString('pt-BR'); // 
    }
    updateDisplay(); // 

    buttons.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.matches('.btn')) {
            return;
        }

        const value = target.dataset.value; 

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
        if (waitingForSecondOperand) {
            displayValue = digit;
            waitingForSecondOperand = false;
        } else {
            displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function inputDecimal() {
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
                    return 0; 
                }
                result = firstOperand / secondOperand;
                break;
            case '%': 
                if (secondOperand === 0) {
                    alert('Erro: Divisão por zero (módulo)!');
                    return 0;
                }
                result = firstOperand % secondOperand;
                break;
        }
        return parseFloat(result.toPrecision(15));
    }

    function handleEquals() {
        if (!operator) return; 

        const result = performCalculation();
        displayValue = String(result);
        firstOperand = null; 
        operator = null; 
        waitingForSecondOperand = false;
    }

    function clearCalculator() {
        displayValue = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
    }

    function negateValue() {
        if (displayValue === '0') return;
        displayValue = String(parseFloat(displayValue) * -1);
    }