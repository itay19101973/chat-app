// State Management Module
const StateManager = (function() {
    let currentUserName = '';
    let currentUserEmail = '';

    // Fetch session data from server
    async function initializeSession() {
        try {
            const response = await fetch('/messages-api/session');

            if(!response.ok) {
                throw new Error(response.statusText);
            }

            const sessionData = await response.json();
            currentUserName = sessionData.userName;
            currentUserEmail = sessionData.email;
        } catch (error) {
            console.error('Error fetching session:', error);
        }
    }

    function getCurrentUser() {
        return {
            userName: currentUserName,
            email: currentUserEmail};
    }

    return {
        getCurrentUser,
        initializeSession
    };
})();

// DOM Module - Handles all DOM interactions
const DOMModule = (function() {
    const elements = {
        messageForm: document.querySelector('form'),
        messageInput: document.querySelector('input[name="message"]'),
        messagesContainer: document.querySelector('.messages-container')
    };

    function renderMessage(message, currentUser) {
        const isOwnMessage = message.userName === currentUser.userName;

        return `
            <div class="message mb-3 ${isOwnMessage ? 'text-end' : ''}" data-message-id="${message.id}">
                <small class="text-muted">${message.userName} - ${new Date(message.createdAt).toLocaleString()}</small>
                <div class="message-content p-2 rounded ${isOwnMessage ? 'bg-primary text-white' : 'bg-light'}">
                    ${message.content}
                    ${isOwnMessage ? `
                        <div class="message-actions mt-1">
                            <button class="btn btn-sm btn-light edit-message">Edit</button>
                            <button class="btn btn-sm btn-danger delete-message">Delete</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
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

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        elements.messagesContainer.parentElement.insertBefore(alertDiv, elements.messagesContainer);
        setTimeout(() => alertDiv.remove(), 5000);
    }

    function clearMessageInput() {
        elements.messageInput.value = '';
    }

    function getMessageInput() {
        return elements.messageInput.value.trim();
    }

    return {
        elements,
        updateMessagesUI,
        showAlert,
        clearMessageInput,
        getMessageInput,
        scrollToBottom
    };
})();

// API Module - Handles all API calls
const APIModule = (function() {
    async function fetchMessages() {
        const response = await fetch('/messages-api/messages');
        if (!response.ok) throw new Error('Failed to fetch messages');
        return response.json();
    }

    async function sendMessage(message) {
        const response = await fetch('/messages-api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    }

    async function updateMessage(messageId, newContent) {
        const response = await fetch(`/messages-api/messages/${messageId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: newContent })
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

// Event Handler Module - Manages all event listeners and their logic
const EventHandlerModule = (function() {
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
            DOMModule.showAlert('Error sending message', 'danger');
        }
    }

    async function handleMessageAction(event) {
        const messageElement = event.target.closest('.message');
        if (!messageElement) return;

        const messageId = messageElement.dataset.messageId;
        const messageContent = messageElement.querySelector('.message-content');

        if (event.target.classList.contains('edit-message')) {
            const currentText = messageContent.textContent.trim();
            const newText = prompt('Edit message:', currentText);

            if (newText && newText !== currentText) {
                try {
                    await APIModule.updateMessage(messageId, newText);
                    await MessageController.refreshMessages();
                } catch (error) {
                    DOMModule.showAlert('Error updating message', 'danger');
                }
            }
        } else if (event.target.classList.contains('delete-message')) {
            if (confirm('Are you sure you want to delete this message?')) {
                try {
                    await APIModule.deleteMessage(messageId);
                    await MessageController.refreshMessages();
                } catch (error) {
                    DOMModule.showAlert('Error deleting message', 'danger');
                }
            }
        }
    }

    function initializeEventListeners() {
        DOMModule.elements.messageForm.addEventListener('submit', handleSubmit);
        DOMModule.elements.messagesContainer.addEventListener('click', handleMessageAction);
    }

    return {
        initializeEventListeners
    };
})();

// Main Controller Module - Orchestrates the application
const MessageController = (function() {
    async function refreshMessages() {
        try {
            const messages = await APIModule.fetchMessages();
            DOMModule.updateMessagesUI(messages);
        } catch (error) {
            console.error('Error:', error);
            DOMModule.showAlert('Error loading messages', 'danger');
        }
    }

    function startPolling(interval = 5000) {
        setInterval(refreshMessages, interval);
    }

    async function initialize() {
        await StateManager.initializeSession();
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