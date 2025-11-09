    // src/firebase.js
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth"; // Example for Auth
    import { getFirestore } from "firebase/firestore"; // Example for Firestore

    const firebaseConfig = {
      apiKey: "AIzaSyCBYUU_HMzy6K2T2w-QeBngo8IMWelvUCo",
      authDomain: "hackutd2025-81991.firebaseapp.com",
      projectId: "hackutd2025-81991",
      storageBucket: "hackutd2025-81991.firebasestorage.app",
      messagingSenderId: "1086118056102",
      appId: "1:1086118056102:web:6cf55bec49660495ca2467",
      measurementId: "G-8SBZMP5S3F"
    };


    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);