import * as admin from "firebase-admin";

/**
 * firebaseAdmin.ts
 *
 * Shared Firebase Admin bootstrap. Initializes once and exports
 * typed accessors for auth, firestore, and storage.
 *
 * Required environment variables:
 *   FIREBASE_PROJECT_ID      — your Firebase project ID
 *   FIREBASE_CLIENT_EMAIL    — service account client email
 *   FIREBASE_PRIVATE_KEY     — service account private key (with \n as newlines)
 *   FIREBASE_STORAGE_BUCKET  — your Cloud Storage bucket (e.g. your-app.appspot.com)
 */

function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin: missing environment variables. " +
        "Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set."
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    storageBucket,
  });
}

/** Firebase Auth instance */
export function adminAuth(): admin.auth.Auth {
  return getAdminApp().auth();
}

/** Firestore instance */
export function adminDb(): admin.firestore.Firestore {
  return getAdminApp().firestore();
}

/** Cloud Storage instance */
export function adminStorage(): admin.storage.Storage {
  return getAdminApp().storage();
}
