// Mobile menu toggle
function toggleMobileMenu(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const menu = document.getElementById('nav-menu');
    const toggle = document.querySelector('.nav-toggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
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

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('nav-menu');
        const toggle = document.querySelector('.nav-toggle');
        if (menu && menu.classList.contains('active')) {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        }
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
