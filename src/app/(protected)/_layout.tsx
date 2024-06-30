import { Redirect, Slot } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";

export default function ProtectedLayout() {
    const { isAuthenticated } = useAuth();
    //We will do guarding at layout level like if a user is not logged in so he will not be able to see the profile screen
    //user login info lies inside the provider in const {user}
    ///if the user is not authenticated
    if(!isAuthenticated) {
    return <Redirect href="/login"/>
    }
    
    //bcoz we dont change or add anything - just simply return the protected screen
    return <Slot />;
}

