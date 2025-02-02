(() => {

    // Constants for different password error messages
    const  emptyPasswordMsg = "Empty Password";
    const  longPasswordMsg = "Empty Password";
    const  unmatchedPasswordMsg = "Empty Password";

    // Event listener for DOMContentLoaded to ensure the DOM is fully loaded before initializing modules
document.addEventListener('DOMContentLoaded', () => {
    const formValidator = (() => {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');


        /**
         * Validates the password and confirm password fields.
         * @returns {Array} An array where the first element is a boolean indicating validity, and the second element is an error message (if any).
         */
        function validatePassword() {

            if (!password.value || !confirmPassword.value) {
                return [false, emptyPasswordMsg];
            }

            if (password.value.length >= 32) {
                return [false, longPasswordMsg];
            }

            if(password.value !== confirmPassword.value)
            {
                return [false, unmatchedPasswordMsg];
            }

            return [true, ""];

        }

        return {
            validatePassword
        };
    })();
    // Error handling module to manage error messages display
    const errorHandler = (() => {
        const errorContainer = document.getElementById('error-message');
        /**
         * Displays an error message in the error container.
         * @param {string} errorMsg - The error message to display.
         */
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
    // Form handling module to manage form submission and validation
    const formHandler = (() => {
        const form = document.getElementById('passwordForm');
        /**
         * Handles form submission by preventing the default behavior and performing password validation.
         * If validation fails, it displays the corresponding error message.
         * @param {Event} e - The form submit event.
         */
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
        /**
         * Initializes form event listeners.
         */
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
