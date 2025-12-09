import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserSajuData } from "../types";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9nFlpvct-o2F48Ow1WLozSsORrWd4YJI",
  authDomain: "dangchat.firebaseapp.com",
  projectId: "dangchat",
  storageBucket: "dangchat.firebasestorage.app",
  messagingSenderId: "260697349202",
  appId: "1:260697349202:web:fdeb3c7aba87b87d33138b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// --- Firestore Helpers ---

// Save user profile to Firestore
export const saveUserProfile = async (uid: string, data: UserSajuData) => {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
    return true;
  } catch (e) {
    console.error("Error saving profile: ", e);
    throw e;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserSajuData | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserSajuData;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error getting profile: ", e);
    return null;
  }
};

// --- Auth Helpers ---

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Login Error", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error", error);
    throw error;
  }
};
