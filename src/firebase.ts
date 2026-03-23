import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Use the provided database ID if available, otherwise use default
export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

export const signIn = () => signInAnonymously(auth);
export const logOut = () => signOut(auth);

async function testConnection() {
  try {
    // This will fail if the project ID is wrong or database isn't initialized
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error.message?.includes('the client is offline')) {
      console.error("Firebase Connection Error: The client is offline. This usually means the Project ID is incorrect or the Firestore database has not been created in the Firebase Console.");
    } else {
      console.error("Firebase Connection Error:", error.message);
    }
  }
}
testConnection();
