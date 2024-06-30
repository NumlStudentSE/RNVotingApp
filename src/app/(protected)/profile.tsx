import { View, Text, Button} from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { supabase } from '../../lib/supabase';
import { Redirect } from 'expo-router';



export default function ProfileScreen() { 
    const {user} = useAuth();
    

    return(
        //? bcoz initially the session and user is null
     <View style={{ padding: 10 }}>
        <Text>User id: {user?.id}</Text>
        <Button title="Sign out" onPress={() => supabase.auth.signOut()}/>
     </View>
    );
}