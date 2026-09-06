import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/*
 * ADMIN SETUP
 * ───────────
 * 1. Firebase console → Authentication → add the admin user (email/password).
 * 2. Copy that user's UID.
 * 3. Firestore → collection `config` → document `admins` → array field `uids`.
 * 4. Add the UID to that array.
 *
 * The app only ever READS config/admins. Membership is granted by hand so a
 * stolen admin session cannot add another account — and firestore.rules denies
 * writes to config/** for everyone, including admins, to enforce that.
 */

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Cache of the allowlist check, keyed by UID.
   *
   * onAuthStateChanged fires on token refresh as well as sign-in, and the
   * provider remounts on navigation, so without this the panel re-read
   * config/admins on essentially every route change. The result cannot change
   * mid-session — membership is edited by hand in the console — so one read per
   * UID per session is the right granularity.
   */
  const adminCache = useRef<Map<string, boolean>>(new Map());

  const resolveAdmin = useCallback(async (uid: string): Promise<boolean> => {
    const cached = adminCache.current.get(uid);
    if (cached !== undefined) return cached;

    try {
      const snap = await getDoc(doc(db, "config", "admins"));
      const uids = snap.exists() ? snap.data()["uids"] : null;
      const allowed = Array.isArray(uids) && uids.includes(uid);
      adminCache.current.set(uid, allowed);
      return allowed;
    } catch {
      // A failed read must not grant access. It is also not cached, so a
      // transient network error does not lock the admin out for the session.
      return false;
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser ? await resolveAdmin(currentUser.uid) : false);
      setLoading(false);
    });
  }, [resolveAdmin]);

  const signIn = useCallback(async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), pass);
  }, []);

  const signOut = useCallback(async () => {
    adminCache.current.clear();
    await firebaseSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
