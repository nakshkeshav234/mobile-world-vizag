// ===================================
// MOBILE WORLD - Booking Form Logic
// Multi-step form with validation
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    initBookingForm();
});

let currentStep = 1;
const totalSteps = 4;
let formData = {};

function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (!form || !nextBtn || !prevBtn) return;

    // Next button click
    nextBtn.addEventListener('click', function () {
        if (currentStep < totalSteps) {
            if (validateCurrentStep()) {
                saveCurrentStepData();
                currentStep++;
                updateFormDisplay();
            }
        } else {
            // Final step - submit form
            submitBooking();
        }
    });

    // Previous button click
    prevBtn.addEventListener('click', function () {
        if (currentStep > 1) {
            currentStep--;
            updateFormDisplay();
        }
    });

    // Add real-time validation
    addInputValidation();
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentStepElement) return false;

    let isValid = true;

    // Get all required inputs in current step
    const requiredInputs = currentStepElement.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
        const fieldName = input.id;
        const errorId = `${fieldName}Error`;

        // Clear previous errors
        window.MobileWorld.hideError(fieldName, errorId);

        // Validate based on step
        switch (currentStep) {
            case 1: // Personal Information
                if (fieldName === 'customerName' && !input.value.trim()) {
                    window.MobileWorld.showError(fieldName, errorId, 'Please enter your name');
                    isValid = false;
                } else if (fieldName === 'customerPhone') {
                    if (!window.MobileWorld.validatePhone(input.value.trim())) {
                        window.MobileWorld.showError(fieldName, errorId, 'Enter valid 10-digit number');
                        isValid = false;
                    }
                }
                break;

            case 2: // Device Details
                if (!input.value.trim()) {
                    window.MobileWorld.showError(fieldName, errorId, 'This field is required');
                    isValid = false;
                }
                break;

            case 3: // Pickup Details
                if (fieldName === 'pickupDate') {
                    const selectedDate = new Date(input.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate <= today) {
                        window.MobileWorld.showError(fieldName, errorId, 'Please select a future date');
                        isValid = false;
                    }
                } else if (!input.value.trim()) {
                    window.MobileWorld.showError(fieldName, errorId, 'This field is required');
                    isValid = false;
                }
                break;

            case 4: // Confirmation
                const termsCheckbox = document.getElementById('termsAgree');
                if (termsCheckbox && !termsCheckbox.checked) {
                    window.MobileWorld.showToast('Please agree to the terms', 'error');
                    isValid = false;
                }
                break;
        }
    });

    return isValid;
}

function saveCurrentStepData() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentStepElement) return;

    const inputs = currentStepElement.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type !== 'checkbox') {
            formData[input.name] = input.value;
        }
    });
}

function updateFormDisplay() {
    // Update step indicator
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum === currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
        }
    });

    // Update form steps visibility
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach(step => {
        step.classList.remove('active');
    });

    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navigationButtons = document.getElementById('navigationButtons');

    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }

    if (currentStep === totalSteps) {
        nextBtn.textContent = 'Submit Booking';
        nextBtn.classList.remove('btn-block');
    } else {
        nextBtn.textContent = 'Next →';
    }

    // Show review summary on step 4
    if (currentStep === 4) {
        displayReviewSummary();
    }
}

function displayReviewSummary() {
    const reviewSummary = document.getElementById('reviewSummary');
    if (!reviewSummary) return;

    const html = `
        <div class="grid gap-md">
            <div>
                <h4 style="margin-bottom: var(--spacing-sm); color: var(--primary-color);">Personal Information</h4>
                <p><strong>Name:</strong> ${formData.customerName}</p>
                <p><strong>Phone:</strong> ${formData.customerPhone}</p>
                ${formData.customerEmail ? `<p><strong>Email:</strong> ${formData.customerEmail}</p>` : ''}
            </div>
            
            <div>
                <h4 style="margin-bottom: var(--spacing-sm); color: var(--primary-color);">Device Information</h4>
                <p><strong>Brand:</strong> ${formData.deviceBrand}</p>
                <p><strong>Model:</strong> ${formData.deviceModel}</p>
                <p><strong>Issue Type:</strong> ${formData.issueType}</p>
                <p><strong>Description:</strong> ${formData.issueDescription}</p>
            </div>
            
            <div>
                <h4 style="margin-bottom: var(--spacing-sm); color: var(--primary-color);">Pickup Details</h4>
                <p><strong>Address:</strong> ${formData.pickupAddress}</p>
                <p><strong>Date:</strong> ${window.MobileWorld.formatDate(formData.pickupDate)}</p>
                <p><strong>Time:</strong> ${formData.pickupTime}</p>
                ${formData.additionalNotes ? `<p><strong>Notes:</strong> ${formData.additionalNotes}</p>` : ''}
            </div>
        </div>
    `;

    reviewSummary.innerHTML = html;
}

function submitBooking() {
    // Save final step data
    saveCurrentStepData();

    // Show loading state
    const nextBtn = document.getElementById('nextBtn');
    const originalText = nextBtn.textContent;
    nextBtn.disabled = true;
    nextBtn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px;"></span> Processing...';

    // Simulate submission delay
    setTimeout(() => {
        // Hide form elements
        const confirmationContent = document.getElementById('confirmationContent');
        const navigationButtons = document.getElementById('navigationButtons');
        const successMessage = document.getElementById('successMessage');

        if (confirmationContent) confirmationContent.style.display = 'none';
        if (navigationButtons) navigationButtons.style.display = 'none';
        if (successMessage) successMessage.classList.remove('hidden');

        // Display booking summary
        displayBookingSummary();

        // Send WhatsApp message
        window.MobileWorld.sendWhatsAppMessage(formData);

        // Reset button
        nextBtn.disabled = false;
        nextBtn.textContent = originalText;

        // Show success toast
        window.MobileWorld.showToast('Booking submitted successfully!', 'success');

        // Trigger confetti animation! 🎉
        if (window.AnimationEngine && window.AnimationEngine.Confetti) {
            window.AnimationEngine.Confetti.create(100);
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
}

function displayBookingSummary() {
    const bookingSummary = document.getElementById('bookingSummary');
    if (!bookingSummary) return;

    const html = `
        <div class="grid gap-sm" style="font-size: var(--text-sm);">
            <p><strong>Name:</strong> ${formData.customerName}</p>
            <p><strong>Phone:</strong> ${formData.customerPhone}</p>
            <p><strong>Device:</strong> ${formData.deviceBrand} ${formData.deviceModel}</p>
            <p><strong>Issue:</strong> ${formData.issueType}</p>
            <p><strong>Pickup:</strong> ${window.MobileWorld.formatDate(formData.pickupDate)} (${formData.pickupTime})</p>
            <p><strong>Address:</strong> ${formData.pickupAddress}</p>
        </div>
        <div class="mt-lg" style="padding: var(--spacing-md); background: var(--gray-50); border-radius: var(--radius-md); font-size: var(--text-sm);">
            <p><strong>📞 We'll call you soon at ${formData.customerPhone} to confirm your pickup!</strong></p>
            <p class="mt-sm text-gray">Save this information or take a screenshot for your reference.</p>
        </div>
    `;

    bookingSummary.innerHTML = html;
}

function addInputValidation() {
    // Phone number formatting
    const phoneInput = document.getElementById('customerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            // Remove non-digits
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
    }

    // Clear error on focus
    const allInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    allInputs.forEach(input => {
        input.addEventListener('focus', function () {
            const errorId = `${this.id}Error`;
            window.MobileWorld.hideError(this.id, errorId);
        });
    });
}

// Make functions available globally if needed
window.BookingForm = {
    validateCurrentStep,
    saveCurrentStepData,
    updateFormDisplay,
    submitBooking
};
