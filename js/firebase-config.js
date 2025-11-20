// ===================================
// MOBILE WORLD - Firebase Configuration
// Database and Authentication Setup
// ===================================

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTyox44w5btd6sQCSbC2Or8VYr4MeOXHY",
    authDomain: "mobile-world-vizag.firebaseapp.com",
    projectId: "mobile-world-vizag",
    storageBucket: "mobile-world-vizag.firebasestorage.app",
    messagingSenderId: "500647634486",
    appId: "1:500647634486:web:dd843a7b51825b87ee1a97",
    measurementId: "G-D7C1PL36PS"
};

// Initialize Firebase
let db;
let auth;

// Initialize Firebase when script loads
function initFirebase() {
    try {
        // Initialize Firebase app
        firebase.initializeApp(firebaseConfig);

        // Initialize Firestore
        db = firebase.firestore();

        // Initialize Authentication
        auth = firebase.auth();

        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
}

// Save booking to Firestore
async function saveBookingToFirebase(bookingData) {
    try {
        // Add timestamp
        const booking = {
            ...bookingData,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Save to Firestore
        const docRef = await db.collection('bookings').add(booking);

        console.log('Booking saved to Firebase with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error saving booking to Firebase:', error);
        return { success: false, error: error.message };
    }
}

// Get all bookings (for admin panel)
async function getAllBookings() {
    try {
        const snapshot = await db.collection('bookings')
            .orderBy('createdAt', 'desc')
            .get();

        const bookings = [];
        snapshot.forEach(doc => {
            bookings.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return bookings;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}

// Update booking status
async function updateBookingStatus(bookingId, status) {
    try {
        await db.collection('bookings').doc(bookingId).update({
            status: status,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating booking status:', error);
        return { success: false, error: error.message };
    }
}

// Delete booking
async function deleteBooking(bookingId) {
    try {
        await db.collection('bookings').doc(bookingId).delete();
        return { success: true };
    } catch (error) {
        console.error('Error deleting booking:', error);
        return { success: false, error: error.message };
    }
}

// Google Sign-In for admin
async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        // Only allow rajuagarwal377@gmail.com
        provider.setCustomParameters({
            hd: 'gmail.com'
        });

        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // Check if email matches
        if (user.email === 'rajuagarwal377@gmail.com') {
            console.log('Admin signed in:', user.email);
            return { success: true, user: user };
        } else {
            // Sign out unauthorized user
            await auth.signOut();
            throw new Error('Unauthorized email. Only rajuagarwal377@gmail.com can access admin panel.');
        }
    } catch (error) {
        console.error('Error signing in:', error);
        return { success: false, error: error.message };
    }
}

// Sign out
async function signOut() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { success: false, error: error.message };
    }
}

// Check auth state
function onAuthStateChanged(callback) {
    auth.onAuthStateChanged(callback);
}

// Initialize Firebase when script loads
initFirebase();

// Export functions for use in other scripts
window.FirebaseDB = {
    saveBooking: saveBookingToFirebase,
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
    signInWithGoogle,
    signOut,
    onAuthStateChanged
};
