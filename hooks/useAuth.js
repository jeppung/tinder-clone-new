import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { auth } from "../firebase";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {

    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);

    const [req, res, promptAsync] = Google.useAuthRequest({
        expoClientId: '1083893074586-ge46kd6g0sij53kn6pjq6qv4nl6hulrr.apps.googleusercontent.com',
        androidClientId: '1083893074586-pl54qqsrv1ro2mmasl7aaknnh6300p8b.apps.googleusercontent.com'
    });

    const logout = () => {
        setLoading(true);

        signOut(auth).catch(error => setError(error)).finally(setLoading(false));
    }
    
    useEffect(() => {
        const storeGoogleLoginToFirebase = async () => {
            const credential = GoogleAuthProvider.credential(res.authentication.idToken, res.authentication.accessToken);

            const result = await signInWithCredential(auth, credential);
        }
        
        if(res?.type === 'success'){
            storeGoogleLoginToFirebase().catch((error) => setError(error));
        }
    }, [res]);


    useEffect(
        () => onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
            }else{
                setUser(null);
            }
            setLoadingInitial(false);
        })
    , []);

    const memoedValue = useMemo(() => ({
        user: user,
        loading,
        error,
        setLoading,
        setError,
        logout,
        promptAsync
    }), [user, loading, error]);

    return (
        <AuthContext.Provider value={memoedValue}>   
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}