import { useEffect, useState } from "react";
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { trpc } from "../lib/trpc";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const syncUser = trpc.system.syncUser.useMutation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        // When the user logs in, we sync their data with our backend.
        const token = await currentUser.getIdToken();
        syncUser.mutate({ 
          token,
          email: currentUser.email,
          name: currentUser.displayName,
          firebaseUid: currentUser.uid
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return { user, loading, loginWithGoogle, logout };
}
