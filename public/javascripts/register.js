document.addEventListener('DOMContentLoaded', () => {
    const formValidator = (() => {
        const email = document.getElementById('email');
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');

        function validateEmail(email) {
            const [localPart, domain] = email.split('@');
            return localPart.length >= 3 &&
                domain.length <= 32 &&
                /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+$/.test(email);
        }

        function validateName(value) {
            return value.length >= 3 &&
                value.length <= 32 &&
                /^[a-zA-Z]+$/.test(value);
        }

        function validateForm() {
            let isValid = true;

            if (!validateEmail(email.value)) {
                errorHandler.showError('email');
                isValid = false;
            }

            if (!validateName(firstName.value)) {
                errorHandler.showError('firstName');
                isValid = false;
            }

            if (!validateName(lastName.value)) {
                errorHandler.showError('lastName');
                isValid = false;
            }

            return isValid;
        }

        return {
            validateForm
        };
    })();

    const errorHandler = (() => {
        function showError(fieldName) {
            const errorDiv = document.getElementById(`${fieldName}-error`);
            errorDiv.classList.remove('d-none');
        }

        function clearErrors() {
            const errorElements = document.querySelectorAll('[id$="-error"]');
            errorElements.forEach(element => element.classList.add('d-none'));
        }

        return {
            showError,
            clearErrors
        };
    })();

    const formHandler = (() => {
        const form = document.getElementById('registerForm');

        function handleSubmit(e) {
            e.preventDefault();
            errorHandler.clearErrors();

            if (!formValidator.validateForm()) {
                return;
            }

            form.submit();
        }

        function init() {
            form.addEventListener('submit', handleSubmit);
        }

        return {
            init
        };
    })();

    formHandler.init();
});