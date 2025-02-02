(() => {
document.addEventListener('DOMContentLoaded', () => {
    const formValidator = (() => {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');

        function validatePassword() {

            if (!password.value || !confirmPassword.value) {
                return [false, "Empty Password"];
            }

            if (password.value.length >= 32) {
                return [false, "Password too long"];
            }

            if(password.value !== confirmPassword.value)
            {
                return [false, "Passwords do not match"];
            }

            return [true, ""];

        }

        return {
            validatePassword
        };
    })();

    const errorHandler = (() => {
        const errorContainer = document.getElementById('error-message');

        function showError(errorMsg) {
            errorContainer.innerHTML = errorMsg;
            errorContainer.classList.remove('d-none'); // Show error message
        }

        function clearError() {
            errorContainer.innerHTML = '';
            errorContainer.classList.add('d-none'); // Hide error message
        }

        return {
            showError,
            clearError
        };
    })();

    const formHandler = (() => {
        const form = document.getElementById('passwordForm');

        function handlePasswordSubmit(e) {
            e.preventDefault();

            errorHandler.clearError(); // Clear any previous error

            let [validPassword, errMsg] = formValidator.validatePassword();

            if (!validPassword) {
                errorHandler.showError(errMsg); // Show error if passwords don't match
                return; // Stop form submission if passwords don't match
            }

            form.submit(); // If validation passes, submit the form
        }

        function init() {
            form.addEventListener('submit', handlePasswordSubmit); // Add event listener
        }

        return {
            init
        };
    })();

    // Initialize form handling after DOM content is loaded
    formHandler.init();
});
})();
