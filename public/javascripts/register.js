document.addEventListener('DOMContentLoaded', () => {
    const formValidator = (() => {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');

        function validatePassword() {

            if (!password || !confirmPassword) {
                return false;
            }

            return password.value === confirmPassword.value;

        }

        return {
            validatePassword
        };
    })();

    const errorHandler = (() => {
        const errorContainer = document.getElementById('error-message');

        function showError() {
            errorContainer.classList.remove('d-none'); // Show error message
        }

        function clearError() {
            errorContainer.classList.add('d-none'); // Hide error message
        }

        return {
            showError,
            clearError
        };
    })();

    const formHandler = (() => {
        const form = document.getElementById('registerForm');

        function handleSubmit(e) {
            e.preventDefault();

            errorHandler.clearError(); // Clear any previous error

            if (!formValidator.validatePassword()) {
                errorHandler.showError(); // Show error if passwords don't match
                return; // Stop form submission if passwords don't match
            }

            form.submit(); // If validation passes, submit the form
        }

        function init() {
            form.addEventListener('submit', handleSubmit); // Add event listener
        }

        return {
            init
        };
    })();

    // Initialize form handling after DOM content is loaded
    formHandler.init();
});
