(() => {
document.addEventListener('DOMContentLoaded', () => {
    // Form validation module to handle validation of form fields
    const formValidator = (() => {
        const email = document.getElementById('email');
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');


        /**
         * Validates the email field.
         * Ensures that the email contains at least 3 characters before '@', no more than 32 characters in the domain,
         * and follows a specific format (letters, numbers, dots, and underscores before '@' and letters and numbers after).
         * @param {string} email - The email to validate.
         * @returns {boolean} True if the email is valid, false otherwise.
         */
        function validateEmail(email) {
            const [localPart, domain] = email.split('@');
            return localPart.length >= 3 &&
                domain.length <= 32 &&
                /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+$/.test(email);
        }

        /**
         * Validates name fields (first and last names).
         * Ensures that the name is between 3 and 32 characters long and only contains alphabetic characters.
         * @param {string} value - The name to validate.
         * @returns {boolean} True if the name is valid, false otherwise.
         */
        function validateName(value) {
            return value.length >= 3 &&
                value.length <= 32 &&
                /^[a-zA-Z]+$/.test(value);
        }

        /**
         * Validates the entire form by checking the email, first name, and last name fields.
         * @returns {boolean} True if the form is valid, false otherwise.
         */
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

    // Error handling module to manage error message visibility for form fields
    const errorHandler = (() => {

        /**
         * Displays an error message for the given field.
         * @param {string} fieldName - The name of the field (e.g., 'email', 'firstName', 'lastName') to show the error for.
         */
        function showError(fieldName) {
            const errorDiv = document.getElementById(`${fieldName}-error`);
            errorDiv.classList.remove('d-none');
        }

        /**
         * Clears all error messages by hiding the error elements.
         */
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

        /**
         * Handles form submission, preventing the default action and performing validation.
         * If the validation fails, it prevents form submission; otherwise, it submits the form.
         * @param {Event} e - The submit event.
         */
        function handleSubmit(e) {
            e.preventDefault();
            errorHandler.clearErrors();

            if (!formValidator.validateForm()) {
                return;
            }

            form.submit();
        }

        /**
         * Initializes the form handler by adding the submit event listener.
         */
        function init() {
            form.addEventListener('submit', handleSubmit);
        }

        return {
            init
        };
    })();

    formHandler.init();
});
})();