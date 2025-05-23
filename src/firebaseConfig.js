// Firebase configuration
// Replace these values with your own Firebase project config
// Get these values from your Firebase console: https://console.firebase.google.com/

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// User authentication helpers
const createUser = async (email, password) => {
  // Add your user creation logic here
};

const signIn = async (email, password) => {
  // Add your sign-in logic here
};

const signOut = async () => {
  // Add your sign-out logic here
};

// Firestore helpers
const saveProgress = async (userId, lessonData) => {
  // Add your progress saving logic here
};

const getUserBadges = async (userId) => {
  // Add your badge retrieval logic here
};

export {
  auth,
  db,
  storage,
  createUser,
  signIn,
  signOut,
  saveProgress,
  getUserBadges
}; 