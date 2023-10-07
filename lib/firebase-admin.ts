var admin = require("firebase-admin");
import serviceAccount from "./space-app-challenge-2023-firebase-adminsdk-4cd43-a70631143c.json";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

const initializeApp = () => {
  admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
};

const createSessionCookie = async (idToken: string) => {
  initializeApp();
  const auth = getAuth();
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
  cookies().set("session", sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
    path: "/",
  });
};

const getSessionUser = async () => {
  initializeApp();
  const auth = getAuth();
  try {
    const session = cookies().get("session")?.value || "";
    const user = await auth.verifySessionCookie(session);
    return user;
  } catch {
    return null;
  }
};

const getUserFromIdToken = async (idToken: string) => {
  initializeApp();
  const auth = getAuth();
  return await auth.verifyIdToken(idToken);
};

export { createSessionCookie, getSessionUser, getUserFromIdToken };
