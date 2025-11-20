// ===================================
// MOBILE WORLD - Admin Panel Logic
// Booking Management Dashboard
// ===================================

let currentBookings = [];
let filteredBookings = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    setupEventListeners();
});

// Check authentication state
function checkAuth() {
    window.FirebaseDB.onAuthStateChanged((user) => {
        if (user && user.email === 'rajuagarwal377@gmail.com') {
            showDashboard(user);
            loadBookings();
        } else {
            showLoginScreen();
        }
    });
}

// Show login screen
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

// Show dashboard
function showDashboard(user) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    document.getElementById('userEmail').textContent = user.email;
}

// Setup event listeners
function setupEventListeners() {
    // Google Sign-In
    document.getElementById('googleSignInBtn').addEventListener('click', handleGoogleSignIn);

    // Sign Out
    document.getElementById('signOutBtn').addEventListener('click', handleSignOut);

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', loadBookings);

    // Status filter
    document.getElementById('statusFilter').addEventListener('change', applyFilters);

    // Search
    document.getElementById('searchInput').addEventListener('input', applyFilters);
}

// Handle Google Sign-In
async function handleGoogleSignIn() {
    const btn = document.getElementById('googleSignInBtn');
    const errorDiv = document.getElementById('loginError');

    btn.disabled = true;
    btn.textContent = 'Signing in...';
    errorDiv.classList.add('hidden');

    const result = await window.FirebaseDB.signInWithGoogle();

    if (!result.success) {
        errorDiv.textContent = result.error || 'Failed to sign in';
        errorDiv.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<span style="margin-right: 8px;">🔐</span> Sign in with Google';
    }
}

// Handle Sign Out
async function handleSignOut() {
    await window.FirebaseDB.signOut();
    showLoginScreen();
}

// Load bookings from Firebase
async function loadBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = '<tr><td colspan="8" class="text-center"><div class="loading-spinner"></div> Loading...</td></tr>';

    currentBookings = await window.FirebaseDB.getAllBookings();
    filteredBookings = [...currentBookings];

    updateStats();
    applyFilters();
}

// Update statistics
function updateStats() {
    const total = currentBookings.length;
    const pending = currentBookings.filter(b => b.status === 'pending').length;
    const completed = currentBookings.filter(b => b.status === 'completed').length;

    document.getElementById('totalBookings').textContent = total;
    document.getElementById('pendingBookings').textContent = pending;
    document.getElementById('completedBookings').textContent = completed;
}

// Apply filters
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();

    filteredBookings = currentBookings.filter(booking => {
        // Status filter
        if (statusFilter !== 'all' && booking.status !== statusFilter) {
            return false;
        }

        // Search filter
        if (searchQuery) {
            const searchFields = [
                booking.customerName,
                booking.customerPhone,
                booking.deviceBrand,
                booking.deviceModel,
                booking.issueType
            ].join(' ').toLowerCase();

            if (!searchFields.includes(searchQuery)) {
                return false;
            }
        }

        return true;
    });

    displayBookings();
}

// Display bookings in table
function displayBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.querySelector('.admin-table-container');

    if (filteredBookings.length === 0) {
        tableContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    tableContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');

    tbody.innerHTML = filteredBookings.map(booking => `
        <tr>
            <td>${formatDate(booking.createdAt)}</td>
            <td>${booking.customerName}</td>
            <td>${booking.customerPhone}</td>
            <td>${booking.deviceBrand} ${booking.deviceModel}</td>
            <td>${booking.issueType}</td>
            <td>${formatSimpleDate(booking.pickupDate)}</td>
            <td>
                <select class="status-select status-${booking.status}" onchange="updateStatus('${booking.id}', this.value)">
                    <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in-progress" ${booking.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
            <td class="action-buttons">
                <button class="btn-icon" onclick="viewBookingDetails('${booking.id}')" title="View Details">👁️</button>
                <button class="btn-icon btn-icon-danger" onclick="deleteBookingConfirm('${booking.id}')" title="Delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Update booking status
async function updateStatus(bookingId, newStatus) {
    const result = await window.FirebaseDB.updateBookingStatus(bookingId, newStatus);

    if (result.success) {
        // Update local data
        const booking = currentBookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = newStatus;
        }
        updateStats();
        showToast('Status updated successfully', 'success');
    } else {
        showToast('Failed to update status', 'error');
        loadBookings(); // Reload to reset
    }
}

// View booking details
function viewBookingDetails(bookingId) {
    const booking = currentBookings.find(b => b.id === bookingId);
    if (!booking) return;

    const content = document.getElementById('bookingDetailContent');
    content.innerHTML = `
        <div class="booking-detail">
            <div class="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${booking.customerName}</p>
                <p><strong>Phone:</strong> <a href="tel:${booking.customerPhone}">${booking.customerPhone}</a></p>
                <p><strong>Email:</strong> ${booking.customerEmail || 'Not provided'}</p>
            </div>
            
            <div class="detail-section">
                <h4>Device Information</h4>
                <p><strong>Brand:</strong> ${booking.deviceBrand}</p>
                <p><strong>Model:</strong> ${booking.deviceModel}</p>
                <p><strong>Issue Type:</strong> ${booking.issueType}</p>
                <p><strong>Description:</strong> ${booking.issueDescription}</p>
            </div>
            
            <div class="detail-section">
                <h4>Pickup Details</h4>
                <p><strong>Address:</strong> ${booking.pickupAddress}</p>
                <p><strong>Date:</strong> ${formatSimpleDate(booking.pickupDate)}</p>
                <p><strong>Time:</strong> ${booking.pickupTime}</p>
                ${booking.additionalNotes ? `<p><strong>Notes:</strong> ${booking.additionalNotes}</p>` : ''}
            </div>
            
            <div class="detail-section">
                <h4>Booking Info</h4>
                <p><strong>Status:</strong> <span class="status-badge status-${booking.status}">${booking.status}</span></p>
                <p><strong>Created:</strong> ${formatDate(booking.createdAt)}</p>
                <p><strong>Last Updated:</strong> ${formatDate(booking.updatedAt)}</p>
            </div>
        </div>
    `;

    document.getElementById('bookingModal').classList.add('active');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

// Delete booking with confirmation
function deleteBookingConfirm(bookingId) {
    const booking = currentBookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (confirm(`Delete booking for ${booking.customerName}?\n\nThis action cannot be undone.`)) {
        deleteBooking(bookingId);
    }
}

async function deleteBooking(bookingId) {
    const result = await window.FirebaseDB.deleteBooking(bookingId);

    if (result.success) {
        showToast('Booking deleted successfully', 'success');
        loadBookings();
    } else {
        showToast('Failed to delete booking', 'error');
    }
}

// Utility: Format date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatSimpleDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}
