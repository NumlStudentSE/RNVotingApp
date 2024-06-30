import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';


export default function AuthLayout() {
    //when we sign in so we move to Auth Provider
    //statechange>user and session info and again go back to layout to provider {user} information
    
    const { isAuthenticated } = useAuth();
    //We will do guarding at layout level like if a user is not logged in so he will not be able to see the profile screen
    //user login info lies inside the provider in const {user}
    ///if the user is not authenticated
    if(isAuthenticated) {
    return <Redirect href="/profile"/>
    }
    
    return <Slot />
}