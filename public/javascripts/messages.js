(() => {
    // State Management Module
    const StateManager = (function () {
        let currentUser = null;

        async function initializeSession() {
            try {
                const response = await fetch('/messages-api/userDetails');
                if (!response.ok) throw new Error(response.statusText);

                const sessionData = await response.json();
                currentUser = sessionData;
            } catch (error) {
                console.error('Error fetching session:', error);
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

    // DOM Module
    const DOMModule = (function () {
        const elements = {
            messageForm: document.querySelector('form'),
            messageInput: document.querySelector('input[name="message"]'),
            messagesContainer: document.querySelector('.messages-container')
        };

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

        function renderMessage(message, currentUser) {
            const isOwnMessage = message.userId === currentUser.userId;

            return `
                <div class="message mb-3 ${isOwnMessage ? 'text-end' : ''}" data-message-id="${message.id}">
                    <small class="text-muted">${message.userName} - ${new Date(message.createdAt).toLocaleString()}</small>
                    <div class="message-content p-2 rounded ${isOwnMessage ? 'bg-primary text-white' : 'bg-light'}">
                        ${message.content}
                    </div>
                    ${isOwnMessage ? `
                        <div class="message-actions mt-1 text-end">
                            <button class="btn btn-sm btn-light edit-message" data-message-id="${message.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-message" data-message-id="${message.id}">Delete</button>
                        </div>
                    ` : ''}
                    </div>`;
        }

        function updateMessagesUI(messages) {
            const currentUser = StateManager.getCurrentUser();
            elements.messagesContainer.innerHTML = messages
                .map(message => renderMessage(message, currentUser))
                .join('');
            scrollToBottom();
        }

        function scrollToBottom() {
            elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
        }

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

        function clearMessageInput() {
            elements.messageInput.value = '';
        }

        function getMessageInput() {
            return elements.messageInput.value.trim();
        }

        return {
            elements,
            createModals,
            updateMessagesUI,
            showToast,
            clearMessageInput,
            getMessageInput,
            scrollToBottom,
            editModal: null,
            deleteModal: null
        };
    })();

    // API Module
    const APIModule = (function () {
        async function fetchMessages() {
            const response = await fetch('/messages-api/messages');
            if (!response.ok) throw new Error('Failed to fetch messages');
            return response.json();
        }

        async function sendMessage(message) {
            const response = await fetch('/messages-api/send-message', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message})
            });
            if (!response.ok) throw new Error('Failed to send message');
            return response.json();
        }

        async function updateMessage(messageId, newContent) {
            const response = await fetch(`/messages-api/messages/${messageId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message: newContent})
            });
            if (!response.ok) throw new Error('Failed to update message');
            return response.json();
        }

        async function deleteMessage(messageId) {
            const response = await fetch(`/messages-api/messages/${messageId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete message');
            return response.json();
        }

        return {
            fetchMessages,
            sendMessage,
            updateMessage,
            deleteMessage
        };
    })();

    // Event Handler Module
    const EventHandlerModule = (function () {
        let currentEditMessageId = null;

        function handleEditClick(messageId, content) {
            currentEditMessageId = messageId;
            document.getElementById('editMessageText').value = content;
            DOMModule.editModal.show();
        }

        function handleDeleteClick(messageId) {
            currentEditMessageId = messageId;
            DOMModule.deleteModal.show();
        }

        async function handleSubmit(event) {
            event.preventDefault();
            const message = DOMModule.getMessageInput();
            if (!message) return;

            try {
                await APIModule.sendMessage(message);
                DOMModule.clearMessageInput();
                await MessageController.refreshMessages();
            } catch (error) {
                console.error('Error:', error);
                DOMModule.showToast('Error sending message', 'danger');
            }
        }

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
        }

        return {
            initializeEventListeners
        };
    })();

    // Main Controller Module
    const MessageController = (function () {
        const POLLING_INTERVAL = 10000;

        async function refreshMessages() {
            try {
                const messages = await APIModule.fetchMessages();
                DOMModule.updateMessagesUI(messages);
            } catch (error) {
                console.error('Error:', error);
                DOMModule.showToast('Error loading messages', 'danger');
            }
        }

        function startPolling(interval = POLLING_INTERVAL) {
            setInterval(refreshMessages, interval);
        }

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