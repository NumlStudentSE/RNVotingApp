//to define React Context for our authentication data that we can reused in multiple places in our application
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

//Session or null - user or null
//Auth Context is an object of 2 fields: session and user
type AuthContext = {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean; //user has a permanent account
};

const AuthContext = createContext<AuthContext>({
  //default values
  session: null,
  user: null,
  isAuthenticated: false,
});

//this provider will render the Auth Context that we have created above
 //Auth Context will serve as the global context to all data that is declared inside it
 //We want the whole application to have access to the information about the user using AuthProvider
export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      //if the session no longer exists so automatically create an anonymous sign in for user
      if (!session) {
        supabase.auth.signInAnonymously();
      }
    });

     //onAuthStateChange Callback
      ///We are subscribing to authentication updates like if user is logout or if the refresh token exipres
      //so then we can update the session
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  
   // console.log(session);
 
   
    return (
      //if session user is true && session user is not anonymous
    <AuthContext.Provider value={{session, user: session?.user ?? null, isAuthenticated: !!session?.user && !session.user.is_anonymous,
    }}
    >
    {children}
    </AuthContext.Provider>
    );
}
//useContext helper hook to easily use the AuthContext
export const useAuth = () => useContext(AuthContext);

