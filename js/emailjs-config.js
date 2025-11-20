// ===================================
// MOBILE WORLD - EmailJS Configuration
// Automatic Email Notifications
// ===================================

// EmailJS credentials
const EMAILJS_CONFIG = {
    serviceId: 'service_1jfnswm',
    templateId: 'template_crpfa37',
    publicKey: 'aVd2CNYOoUyD7SZnq'
};

// Initialize EmailJS
function initEmailJS() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('EmailJS initialized successfully');
}

// Send booking notification email
async function sendBookingEmail(bookingData) {
    try {
        // Prepare email template parameters
        const templateParams = {
            customer_name: bookingData.customerName,
            customer_phone: bookingData.customerPhone,
            customer_email: bookingData.customerEmail || 'Not provided',
            device_brand: bookingData.deviceBrand,
            device_model: bookingData.deviceModel,
            issue_type: bookingData.issueType,
            issue_description: bookingData.issueDescription,
            pickup_address: bookingData.pickupAddress,
            pickup_date: bookingData.pickupDate,
            pickup_time: bookingData.pickupTime,
            additional_notes: bookingData.additionalNotes || 'None'
        };

        // Send email
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('Email sent successfully!', response.status, response.text);
        return { success: true, response };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: error.message };
    }
}

// Initialize when script loads
initEmailJS();

// Export for use in other scripts
window.EmailService = {
    sendBookingEmail
};
