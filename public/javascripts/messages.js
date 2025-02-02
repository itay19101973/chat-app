(() => {

    let lastUpdated =  Date.now();

    /**
     * StateManager Module
     * Manages the current user session state, including fetching and storing user details.
     * Exposes methods to initialize a user session and retrieve the current user.
     */
    const StateManager = (function () {
        let currentUser = null;
        const userDetailsError = 'Error fetching user detailes:';


        /**
         * Initializes the user session by fetching user details from the API.
         * Makes an asynchronous request to fetch user details from '/messages-api/userDetails'.
         * On success, it updates the `currentUser` with the session data.
         * On failure, it logs an error message.
         * @returns {Promise<void>} A promise that resolves when the session is initialized.
         */
        async function initializeSession() {
            try {
                const response = await fetch('/messages-api/userDetails');
                if (!response.ok) throw new Error(response.statusText);

                const sessionData = await response.json();
                currentUser = sessionData;
            } catch (error) {
                console.error(userDetailsError, error);
            }
        }

        function getCurrentUser() {
            return currentUser;
        }

        return {
            getCurrentUser,
            initializeSession
        };
    })();

    /**
     * DOMModule - Responsible for interacting with the DOM, managing search results, messages, modals, and notifications.
     */
    const DOMModule = (function () {

        // Cache DOM elements
        const elements = {
            messageForm: document.querySelector('#messageForm'),
            messageInput: document.querySelector('input[name="message"]'),
            messagesContainer: document.querySelector('.messages-container'),
            searchForm: document.querySelector('#searchForm'),
            searchInput: document.querySelector('#searchInput'),
            searchResults: document.querySelector('#searchResults'),
            searchResultsContainer: document.querySelector('.search-results-container'),
            clearSearchBtn: document.querySelector('#clearSearch')
        };
        /**
         * Renders a single search result for a message.
         * @param {object} message - The message object containing the content and user details.
         * @param {object} currentUser - The current user's details.
         * @returns {string} - The HTML string for a search result.
         */
        function renderSearchResult(message, currentUser) {
            return `
            <div class="search-result p-3 border-bottom hover-shadow transition-all" 
     style="transition: all 0.2s ease-in-out;">
    <div class="d-flex justify-content-between align-items-start mb-2">
        <div class="user-info">
            <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                <i class="bi bi-person-circle me-1"></i>
                ${message.User.firstName}
            </span>
            <small class="text-muted ms-2">
                <i class="bi bi-clock me-1"></i>
                ${new Date(message.createdAt).toLocaleString()}
            </small>
        </div>
    </div>
    <div class="message-content ps-2 ms-1 border-start border-primary">
        <p class="mb-0 text-break fw-light">
            ${message.content}
        </p>
    </div>
</div>
        `;
        }


        /**
         * Updates the UI with search results based on the provided messages.
         * @param {Array} messages - List of message objects to display in the search results.
         */
        function updateSearchResults(messages) {
            const currentUser = StateManager.getCurrentUser();
            if (messages.length === 0) {
                elements.searchResultsContainer.innerHTML = '<p class="text-muted p-2">No messages found</p>';
            } else {
                elements.searchResultsContainer.innerHTML = messages
                    .map(message => renderSearchResult(message, currentUser))
                    .join('');
            }
            elements.searchResults.classList.remove('d-none');
        }


        /**
         * Clears the search input and hides the search results.
         */
        function clearSearch() {
            elements.searchInput.value = '';
            elements.searchResults.classList.add('d-none');
        }


        /**
         * Creates and appends modal HTML for editing and deleting messages.
         */
        function createModals() {
            // Create edit modal HTML
            const editModalHTML = `
                <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editModalLabel">Edit Message</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <textarea class="form-control" id="editMessageText" rows="3"></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" id="saveEdit">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Create delete modal HTML
            const deleteModalHTML = `
                <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>Are you sure you want to delete this message?</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append modals to body
            document.body.insertAdjacentHTML('beforeend', editModalHTML + deleteModalHTML);

            // Initialize Bootstrap modals
            this.editModal = new bootstrap.Modal(document.getElementById('editModal'));
            this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        }


        /**
         * Renders a single message in the UI.
         * @param {object} message - The message object containing content, user details, and ID.
         * @param {object} currentUser - The current user's details to differentiate their messages.
         * @returns {string} - The HTML string for a message.
         */
        function renderMessage(message, currentUser) {
            const isOwnMessage = message.User.id === currentUser.userId;

            return `
                <div class="message mb-4 ${isOwnMessage ? 'text-end' : ''}" data-message-id="${message.id}">
    <div class="d-flex ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'} align-items-end mb-1">
        <div class="message-wrapper ${isOwnMessage ? 'ms-auto' : 'me-auto'}" style="max-width: 80%;">
            <small class="text-muted d-block mb-1 ${isOwnMessage ? 'text-end' : 'text-start'}">
                <span class="fw-semibold">${message.User.firstName}</span>
                <span class="ms-2 opacity-75">${new Date(message.createdAt).toLocaleString()}</span>
            </small>
            <div class="message-content p-3 rounded-4 shadow-sm ${isOwnMessage ? 'bg-primary bg-gradient text-white' : 'bg-light border'}"
                 style="word-wrap: break-word;">
                ${message.content}
            </div>
            ${isOwnMessage ? `
                <div class="message-actions mt-2 d-flex gap-2 justify-content-end">
                    <button class="btn btn-sm btn-light rounded-pill px-3 edit-message shadow-sm" 
                            data-message-id="${message.id}">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger rounded-pill px-3 delete-message shadow-sm" 
                            data-message-id="${message.id}">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            ` : ''}
        </div>
    </div>
</div>`;
        }


        /**
         * Updates the message container with new messages and scrolls to the bottom.
         * @param {Array} messages - List of message objects to render in the container.
         */
        function updateMessagesUI(messages) {
            const currentUser = StateManager.getCurrentUser();
            elements.messagesContainer.innerHTML = messages
                .map(message => renderMessage(message, currentUser))
                .join('');
            scrollToBottom();
        }


        /**
         * Scrolls the message container to the bottom.
         */
        function scrollToBottom() {
            elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
        }


        /**
         * Shows a toast notification with a custom message.
         * @param {string} message - The notification message.
         * @param {string} [type='success'] - The type of notification ('success', 'danger', etc.).
         */
        function showToast(message, type = 'success') {
            const toastHTML = `
                <div class="toast-container position-fixed top-0 end-0 p-3">
                    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header">
                            <strong class="me-auto">Notification</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body bg-${type} text-white">
                            ${message}
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', toastHTML);
            const toastElement = document.querySelector('.toast:last-child');
            const toast = new bootstrap.Toast(toastElement);
            toast.show();

            // Remove toast after it's hidden
            toastElement.addEventListener('hidden.bs.toast', () => {
                toastElement.remove();
            });
        }


        /**
         * Clears the message input field.
         */
        function clearMessageInput() {
            elements.messageInput.value = '';
        }


        /**
         * Retrieves the current value of the message input field.
         * @returns {string} - The trimmed message input value.
         */
        function getMessageInput() {
            return elements.messageInput.value.trim();
        }

        return {
            elements,
            updateSearchResults,
            clearSearch,
            createModals,
            updateMessagesUI,
            showToast,
            clearMessageInput,
            getMessageInput,
            editModal: null,
            deleteModal: null
        };
    })();

    const APIModule = (function () {
        async function checkUpdate()
        {
            const res = await fetch('/messages-api/get-updated-date');

            if(!res.ok)
            {
                throw new Error(res.statusText);
            }

            return await res.json();

        }

        // Handle the case when the session is not valid and redirect is needed
        async function handleRedirect(response) {
            if (response.status === 401) {
                const data = await response.json();
                if (data.redirect) {
                    window.location.href = data.redirect;  // Perform client-side redirect
                    return true;  // Indicate that redirect happened
                }
            }
            return false;  // No redirect needed
        }

        // Fetch messages from the API
        async function fetchMessages() {
            const response = await fetch('/messages-api/messages');

            // Check if redirect is needed (invalid session)
            if (await handleRedirect(response)) return;

            if (response.status === 204) {
                return response;
            }

            if (!response.ok) throw new Error('Failed to fetch messages');
            return response.json();
        }

        // Send a new message to the API
        async function sendMessage(message) {
            const response = await fetch('/messages-api/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            // Check if redirect is needed (invalid session)
            if (await handleRedirect(response)) return;

            if (!response.ok) throw new Error('Failed to send message');
            return response.json();
        }

        // Update an existing message in the API
        async function updateMessage(messageId, newContent) {
            const response = await fetch(`/messages-api/messages/${messageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newContent })
            });

            // Check if redirect is needed (invalid session)
            if (await handleRedirect(response)) return;

            if (!response.ok) throw new Error('Failed to update message');
            return response.json();
        }

        // Delete a message from the API
        async function deleteMessage(messageId) {
            const response = await fetch(`/messages-api/messages/${messageId}`, {
                method: 'DELETE'
            });

            // Check if redirect is needed (invalid session)
            if (await handleRedirect(response)) return;

            if (!response.ok) throw new Error('Failed to delete message');
            return response.json();
        }

        async function searchMessages(searchText) {
            const response = await fetch(`/messages-api/search/${encodeURIComponent(searchText)}`);

            if (await handleRedirect(response)) return;

            if (!response.ok) throw new Error('Failed to search messages');
            return response.json();
        }

        // Expose public API methods
        return {
            fetchMessages,
            sendMessage,
            updateMessage,
            deleteMessage,
            searchMessages,
            checkUpdate
        };
    })();

    /**
     * EventHandlerModule handles all event-driven logic for the chat application,
     * including submitting messages, editing, deleting, searching, and initializing event listeners.
     */
    const EventHandlerModule = (function () {
        let currentEditMessageId = null;


        /**
         * Handles the click event for editing a message.
         * Populates the edit modal with the message content and shows the modal.
         *
         * @param {string} messageId - The ID of the message to edit.
         * @param {string} content - The content of the message to populate in the edit field.
         */
        function handleEditClick(messageId, content) {
            currentEditMessageId = messageId;
            document.getElementById('editMessageText').value = content;
            DOMModule.editModal.show();
        }

        /**
         * Handles the click event for deleting a message.
         * Opens the delete confirmation modal for the selected message.
         *
         * @param {string} messageId - The ID of the message to delete.
         */
        function handleDeleteClick(messageId) {
            currentEditMessageId = messageId;
            DOMModule.deleteModal.show();
        }


        /**
         * Handles the form submission for sending a new message.
         * Sends the message to the API, clears the input field, and refreshes the message list.
         *
         * @param {Event} event - The form submission event.
         * @returns {Promise<void>}
         */
        async function handleSubmit(event) {
            event.preventDefault();
            const message = DOMModule.getMessageInput();
            if (!message) return;

            try {
                await APIModule.sendMessage(message);
                DOMModule.clearMessageInput();
                await MessageController.refreshMessages();
                lastUpdated =  Date.now();
            } catch (error) {
                console.error('Error:', error);
                DOMModule.showToast('Error sending message', 'danger');
            }
        }


        /**
         * Handles the form submission for searching messages.
         * Sends the search query to the API and updates the UI with the search results.
         *
         * @param {Event} event - The form submission event.
         * @returns {Promise<void>}
         */
        async function handleSearch(event) {
            event.preventDefault();
            const searchText = DOMModule.elements.searchInput.value.trim();
            if (!searchText) return;

            try {
                const results = await APIModule.searchMessages(searchText);
                DOMModule.updateSearchResults(results);
            } catch (error) {
                console.error('Error:', error);
                DOMModule.showToast('Error searching messages', 'danger');
            }
        }


        /**
         * Initializes event listeners for the form submissions, edit, delete, and search actions.
         * Registers event listeners on the DOM elements to handle user interaction.
         */
        function initializeEventListeners() {
            // Form submission
            DOMModule.elements.messageForm.addEventListener('submit', handleSubmit);

            // Edit message
            document.getElementById('saveEdit').addEventListener('click', async () => {
                const newText = document.getElementById('editMessageText').value.trim();
                if (newText && currentEditMessageId) {
                    try {
                        await APIModule.updateMessage(currentEditMessageId, newText);
                        DOMModule.editModal.hide();
                        await MessageController.refreshMessages();
                        lastUpdated = Date.now();
                        DOMModule.showToast('Message updated successfully');
                    } catch (error) {
                        DOMModule.showToast('Error updating message', 'danger');
                    }
                }
            });

            // Delete message
            document.getElementById('confirmDelete').addEventListener('click', async () => {
                if (currentEditMessageId) {
                    try {
                        await APIModule.deleteMessage(currentEditMessageId);
                        DOMModule.deleteModal.hide();
                        await MessageController.refreshMessages();
                        lastUpdated = Date.now();
                        DOMModule.showToast('Message deleted successfully');
                    } catch (error) {
                        DOMModule.showToast('Error deleting message', 'danger');
                    }
                }
            });

            // Message actions delegation
            DOMModule.elements.messagesContainer.addEventListener('click', (event) => {
                const messageElement = event.target.closest('.message');
                if (!messageElement) return;

                const messageId = messageElement.dataset.messageId;
                const messageContent = messageElement.querySelector('.message-content').textContent.trim();

                if (event.target.classList.contains('edit-message')) {
                    handleEditClick(messageId, messageContent);
                } else if (event.target.classList.contains('delete-message')) {
                    handleDeleteClick(messageId);
                }
            });

            // Search form
            DOMModule.elements.searchForm.addEventListener('submit', handleSearch);

            // Clear search
            DOMModule.elements.clearSearchBtn.addEventListener('click', () => {
                DOMModule.clearSearch();
            });
        }

        return {
            initializeEventListeners
        };
    })();

    /**
     * MessageController is responsible for handling message fetching, refreshing,
     * and polling for new messages in the chat application.
     */
    const MessageController = (function () {
        const POLLING_INTERVAL = 10000;



        /**
         * Polls the server to check for message updates.
         * If a newer update exists, refreshes the messages.
         *
         * @returns {Promise<void>}
         */
        async function pollMessages()
        {
            try{
                let currentUpdate =  new Date(await APIModule.checkUpdate());

                console.log(currentUpdate);
                if(lastUpdated < currentUpdate)
                {
                    lastUpdated = currentUpdate;
                    await refreshMessages();
                }
            }
            catch (error)
            {
                console.error(error.message);
            }

        }

        /**
         * Fetches messages from the API and updates the UI.
         *
         * @returns {Promise<void>}
         */
        async function refreshMessages() {
            try {

                const res = await APIModule.fetchMessages();

                DOMModule.updateMessagesUI(res);
            } catch (error) {
                DOMModule.showToast('Error loading messages', 'danger');

            }
        }

        /**
         * Starts polling the server for new messages at the specified interval.
         *
         * @param {number} [interval=POLLING_INTERVAL] - The interval in milliseconds between polls.
         */
        function startPolling(interval = POLLING_INTERVAL) {
            setInterval(pollMessages, interval);
        }

        /**
         * Initializes the chat application.
         * Sets up session state, initializes the DOM and event listeners, and starts polling for messages.
         *
         * @returns {Promise<void>}
         */
        async function initialize() {
            await StateManager.initializeSession();
            DOMModule.createModals();
            EventHandlerModule.initializeEventListeners();
            await refreshMessages();
            startPolling();
        }

        return {
            initialize,
            refreshMessages
        };
    })();

    // Initialize the application
    document.addEventListener('DOMContentLoaded', MessageController.initialize);
})();