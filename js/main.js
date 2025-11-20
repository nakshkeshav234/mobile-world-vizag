// ===================================
// MOBILE WORLD - Main JavaScript
// Core functionality and interactions
// ===================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initScrollAnimations();
    setMinPickupDate();
});

// ===================================
// NAVIGATION BAR
// ===================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    // Mobile menu toggle
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            
            // Change icon
            if (navbarMenu.classList.contains('active')) {
                navbarToggle.textContent = '✕';
            } else {
                navbarToggle.textContent = '☰';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navbarMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarMenu.classList.remove('active');
                navbarToggle.textContent = '☰';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbar.contains(event.target)) {
                navbarMenu.classList.remove('active');
                navbarToggle.textContent = '☰';
            }
        });
    }
    
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = 'var(--shadow-lg)';
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.boxShadow = 'var(--shadow-md)';
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and feature boxes
    const animatedElements = document.querySelectorAll('.card, .feature-box, .pricing-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// SMOOTH SCROLL TO SECTIONS
// ===================================
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===================================
// FORM VALIDATION HELPERS
// ===================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
}

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input && error) {
        input.classList.add('error');
        error.textContent = message;
        error.classList.remove('hidden');
    }
}

function hideError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input && error) {
        input.classList.remove('error');
        error.classList.add('hidden');
    }
}

// ===================================
// TOAST NOTIFICATIONS
// ===================================
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    
    const icon = type === 'success' ? '✓' : '✕';
    toast.innerHTML = `
        <div style="font-size: var(--text-2xl);">${icon}</div>
        <div>
            <div style="font-weight: 600;">${type === 'success' ? 'Success' : 'Error'}</div>
            <div style="font-size: var(--text-sm); color: var(--gray-600);">${message}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// ===================================
// MODAL FUNCTIONS
// ===================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===================================
// SET MINIMUM DATE FOR PICKUP
// ===================================
function setMinPickupDate() {
    const pickupDateInput = document.getElementById('pickupDate');
    if (pickupDateInput) {
        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        
        pickupDateInput.min = `${year}-${month}-${day}`;
        
        // Set maximum date to 30 days from now
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        
        const maxYear = maxDate.getFullYear();
        const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
        const maxDay = String(maxDate.getDate()).padStart(2, '0');
        
        pickupDateInput.max = `${maxYear}-${maxMonth}-${maxDay}`;
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as XXX-XXX-XXXX
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return cleaned;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

// ===================================
// WHATSAPP INTEGRATION
// ===================================
function sendWhatsAppMessage(bookingData) {
    const message = `*New Repair Booking*\n\n` +
        `*Customer Details:*\n` +
        `Name: ${bookingData.customerName}\n` +
        `Phone: ${bookingData.customerPhone}\n` +
        `${bookingData.customerEmail ? `Email: ${bookingData.customerEmail}\n` : ''}` +
        `\n*Device Information:*\n` +
        `Brand: ${bookingData.deviceBrand}\n` +
        `Model: ${bookingData.deviceModel}\n` +
        `Issue: ${bookingData.issueType}\n` +
        `Description: ${bookingData.issueDescription}\n` +
        `\n*Pickup Details:*\n` +
        `Address: ${bookingData.pickupAddress}\n` +
        `Date: ${formatDate(bookingData.pickupDate)}\n` +
        `Time: ${bookingData.pickupTime}\n` +
        `${bookingData.additionalNotes ? `Notes: ${bookingData.additionalNotes}\n` : ''}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919246620123?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Export functions for use in other scripts
window.MobileWorld = {
    validateEmail,
    validatePhone,
    showError,
    hideError,
    showToast,
    openModal,
    closeModal,
    formatPhoneNumber,
    formatDate,
    sendWhatsAppMessage,
    smoothScrollTo
};
