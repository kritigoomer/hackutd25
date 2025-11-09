import admin from "firebase-admin";
import path from "path";

// Path to your JSON key
const serviceAccount = path.resolve("C:\Users\aliso\Downloads\hackutd2025-81991-firebase-adminsdk-fbsvc-403e715cbc.json"); // adjust path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hackutd2025-81991.firebaseio.com" // for Realtime DB (optional)
});

// Export Firestore and Auth
export const db = admin.firestore();
export const auth = admin.auth();
