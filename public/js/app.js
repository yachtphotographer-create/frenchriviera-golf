// Mobile menu toggle
function toggleMobileMenu(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const menu = document.getElementById('nav-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    const toggle = document.querySelector('.nav-toggle');

    if (menu) {
        menu.classList.toggle('active');
    }
    if (overlay) {
        overlay.classList.toggle('active');
    }
    if (toggle) {
        toggle.classList.toggle('active');
    }

    // Prevent body scroll when menu is open
    if (menu && menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Initialize mobile menu with touch support
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.nav-toggle');
    if (toggle) {
        // Remove onclick attribute and use event listener for better iOS support
        toggle.removeAttribute('onclick');

        // Use both click and touchend for iOS compatibility
        toggle.addEventListener('click', toggleMobileMenu);
        toggle.addEventListener('touchend', function(e) {
            e.preventDefault();
            toggleMobileMenu(e);
        }, { passive: false });
    }

    // Close menu when clicking a link
    const menuLinks = document.querySelectorAll('.nav-menu-mobile a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            const menu = document.getElementById('nav-menu');
            const overlay = document.getElementById('mobile-menu-overlay');
            const toggle = document.querySelector('.nav-toggle');
            if (menu) menu.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            if (toggle) toggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});

// Auto-hide alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

// Password confirmation match
document.addEventListener('DOMContentLoaded', function() {
    const passwordConfirm = document.getElementById('password_confirm');
    const password = document.getElementById('password');

    if (passwordConfirm && password) {
        passwordConfirm.addEventListener('input', function() {
            if (this.value !== password.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});

// Photo upload preview
document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('photo');
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.querySelector('.current-photo img, .current-photo .avatar-placeholder');
                    if (preview) {
                        if (preview.tagName === 'IMG') {
                            preview.src = e.target.result;
                        } else {
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            preview.parentNode.replaceChild(img, preview);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Dropdown hover behavior for touch devices
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const menu = this.querySelector('.nav-dropdown-menu');
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                e.stopPropagation();
            }
        });
    });

    document.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });
});

// Favorite courses checkbox limit (max 3)
document.addEventListener('DOMContentLoaded', function() {
    const courseCheckboxes = document.querySelectorAll('.course-checkbox');
    const maxCourses = 3;

    if (courseCheckboxes.length > 0) {
        courseCheckboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                const checked = document.querySelectorAll('.course-checkbox:checked');
                const parent = this.closest('.course-checkbox-item');

                // Toggle selected class on parent
                if (this.checked) {
                    parent.classList.add('selected');
                } else {
                    parent.classList.remove('selected');
                }

                // Limit to max 3 selections
                if (checked.length > maxCourses) {
                    this.checked = false;
                    parent.classList.remove('selected');
                    alert('You can select up to ' + maxCourses + ' favorite courses.');
                }
            });
        });
    }
});

// Real-time notifications via Socket.io
document.addEventListener('DOMContentLoaded', function() {
    // Only connect if Socket.io is available and user is logged in
    if (typeof io !== 'undefined') {
        const socket = io();

        // Listen for new notifications
        socket.on('new-notification', function(notification) {
            // Update notification badge in navbar
            updateNotificationBadge(1);

            // Show toast notification
            showToastNotification(notification);

            // Play notification sound
            playNotificationSound();
        });
    }

    // Poll for new notifications every 30 seconds (for cron-generated notifications)
    let lastNotificationCount = getCurrentNotificationCount();

    setInterval(async function() {
        try {
            const response = await fetch('/notifications/api');
            if (response.ok) {
                const data = await response.json();
                const unreadCount = data.notifications.filter(n => !n.read).length;
                const currentCount = getCurrentNotificationCount();

                if (unreadCount > currentCount) {
                    // New notifications arrived
                    const diff = unreadCount - currentCount;
                    updateNotificationBadge(diff);

                    // Show toast for the newest notification
                    if (data.notifications.length > 0 && !data.notifications[0].read) {
                        showToastNotification(data.notifications[0]);
                        playNotificationSound();
                    }
                }
            }
        } catch (e) {
            // Ignore polling errors
        }
    }, 30000);
});

// Get current notification count from badge
function getCurrentNotificationCount() {
    const badge = document.querySelector('.notification-badge');
    if (!badge) return 0;
    const text = badge.textContent;
    if (text.includes('+')) return 10;
    return parseInt(text) || 0;
}

// Update notification badge count
function updateNotificationBadge(increment) {
    const badges = document.querySelectorAll('.notification-badge');

    if (badges.length > 0) {
        badges.forEach(badge => {
            let currentCount = parseInt(badge.textContent) || 0;
            if (badge.textContent.includes('+')) {
                currentCount = 9;
            }
            const newCount = currentCount + increment;
            badge.textContent = newCount > 9 ? '9+' : newCount;
            badge.style.display = 'inline-block';
        });
    } else {
        // Create badge if it doesn't exist
        const notifLinks = document.querySelectorAll('.nav-notifications');
        notifLinks.forEach(link => {
            const badge = document.createElement('span');
            badge.className = 'notification-badge';
            badge.textContent = '1';
            link.appendChild(badge);
        });
    }
}

// Show toast notification
function showToastNotification(notification) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = 'background: white; padding: 16px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 320px; cursor: pointer; border-left: 4px solid var(--color-primary, #1B5E20); animation: slideIn 0.3s ease;';
    toast.innerHTML = `
        <strong style="display: block; margin-bottom: 4px; color: #1a1a1a;">${notification.title}</strong>
        <p style="margin: 0; color: #666; font-size: 0.875rem;">${notification.message}</p>
    `;

    // Add click handler to navigate to notification link
    if (notification.link) {
        toast.addEventListener('click', function() {
            window.location.href = notification.link;
        });
    }

    toastContainer.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 5000);
}

// Play notification sound
function playNotificationSound() {
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

// Add CSS animation for toast
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
})();
