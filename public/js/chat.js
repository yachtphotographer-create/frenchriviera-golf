// Chat client for game chat
class GameChat {
    constructor(gameId) {
        this.gameId = gameId;
        this.socket = io();
        this.messagesContainer = document.getElementById('chat-messages');
        this.messageForm = document.getElementById('chat-form');
        this.messageInput = document.getElementById('chat-input');

        this.init();
        this.requestNotificationPermission();
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    init() {
        // Join the game chat room
        this.socket.emit('join-game', this.gameId);

        // Listen for new messages
        this.socket.on('new-message', (message) => {
            this.appendMessage(message);
            this.scrollToBottom();

            // Show notification if message is from someone else and page is not focused
            if (message.sender_id !== window.currentUserId) {
                this.showNotification(message);
            }
        });

        // Handle form submission
        if (this.messageForm) {
            this.messageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        // Scroll to bottom on load
        this.scrollToBottom();
    }

    sendMessage() {
        const content = this.messageInput.value.trim();

        if (!content) return;

        this.socket.emit('send-message', {
            gameId: this.gameId,
            content: content
        });

        this.messageInput.value = '';
        this.messageInput.focus();
    }

    appendMessage(message) {
        const isOwn = message.sender_id === window.currentUserId;

        // Build DOM elements safely (no innerHTML with user data)
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${isOwn ? 'own' : ''}`;

        // Avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        if (message.profile_photo) {
            const img = document.createElement('img');
            img.src = message.profile_photo;
            img.alt = '';
            avatarDiv.appendChild(img);
        } else {
            const span = document.createElement('span');
            span.textContent = (message.display_name || '?').charAt(0);
            avatarDiv.appendChild(span);
        }

        // Content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';

        const authorSpan = document.createElement('span');
        authorSpan.className = 'message-author';
        authorSpan.textContent = message.display_name || '';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.formatTime(message.created_at);

        headerDiv.appendChild(authorSpan);
        headerDiv.appendChild(timeSpan);

        const textP = document.createElement('p');
        textP.className = 'message-text';
        textP.textContent = message.content || '';

        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(textP);

        messageEl.appendChild(avatarDiv);
        messageEl.appendChild(contentDiv);

        this.messagesContainer.appendChild(messageEl);
    }

    scrollToBottom() {
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        // Play notification sound
        this.playNotificationSound();

        // Show browser notification if permitted and page not focused
        if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
            const notification = new Notification('New message from ' + message.display_name, {
                body: message.content.substring(0, 100),
                icon: '/images/logo.png',
                tag: 'chat-' + this.gameId
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // Auto close after 5 seconds
            setTimeout(() => notification.close(), 5000);
        }

        // Update page title to show unread count
        if (document.hidden) {
            document.title = '(New message) ' + document.title.replace(/^\(New message\) /, '');
        }
    }

    playNotificationSound() {
        // Create a simple notification sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.1;

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio not supported, ignore
        }
    }
}

// Initialize chat if on game detail page with chat enabled
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('game-chat');
    if (chatContainer) {
        const gameId = chatContainer.dataset.gameId;
        if (gameId) {
            window.gameChat = new GameChat(parseInt(gameId));
        }
    }
});
