import { Stack } from 'expo-router';
import { Alert, StyleSheet, Text, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Poll } from '../types/db';

// To see which poll item question we have clicked: URL Search Parameter
// https://localhost:8082/polls/details?id=2  OR
// https://localhost:8082/polls/2 e.g., https://localhost:8082/users/VadimNotjustdev

export default function HomeScreen() {
    const [polls, setPolls] = useState<Poll[]>([]);

    // to dynamically fetch the data from database when required into an empty array list
    useEffect(() => {
        // async function fetchPolls
        const fetchPolls = async () => {
            console.log('Fetching...');
            // supabase client
            let { data, error } = await supabase.from('polls').select('*');
            if (error) {
                Alert.alert('Error fetching data');
            } else if (data) {
                setPolls(data);
            }
        };
        fetchPolls();
    }, []);

    return (
        // jsx only returns 1 component
        // empty fragment is returned, 2 nested components inside it
        // to render list of data we use FlatList
        <>
            <Stack.Screen
                options={{
                    title: 'Polls',
                    headerRight: () => (
                        <Link href={'/polls/new'}>
                            <AntDesign name="plus" size={20} color="gray" />
                        </Link>
                    ),
                    // another way to add + sign 
                    // headerRight: () => (
                    //  <AntDesign 
                    //  onPress={() => router.push('/poll/new')}
                    //  name="plus" 
                    //  size={20} 
                    //  color="gray" /> 
                    // ),
                    headerLeft: () => (
                        <Link href={'/profile'}>
                            <AntDesign name="user" size={20} color="gray" />
                        </Link>
                    ),
                }}
            />

            <FlatList
                data={polls}
                contentContainerStyle={styles.container}
                renderItem={({ item }) => (
                    <Link href={`/polls/${item.id}`} style={styles.pollContainer}>
                        <Text style={styles.pollTitle}>{item.question}</Text>
                    </Link>
                )}
                keyExtractor={item => item.id.toString()}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        gap: 5,
    },
    pollContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        // marginVertical: 10,
    },
    pollTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
