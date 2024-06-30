import { Stack, useLocalSearchParams} from 'expo-router';
import { View, Text, StyleSheet, Pressable, Button, ActivityIndicator, Alert} from 'react-native';
import { Feather } from '@expo/vector-icons';
//to keep track of which option is selected we use State
import { useEffect, useState } from 'react';
import { Poll, Vote } from '../../types/db';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';


//dynamic puff parameter [id]
export default function PollDetails() {
    //hook useLocalSearchParams
const { id } = useLocalSearchParams<{id: string}>(); //used when you're fetching data on the screen based on the search parameters bcoz you want the screen to always render data that it represents.

const [poll, setPoll] = useState<Poll | null>(null);
//to see what we have voted for
const [userVote, setUserVote] = useState<Vote | null>(null);

//const { id: globalId } = useGlobalSearchParams(); //very few cases maybe in analytics where you want to see the actual or current id of the page or the last one page.
//console.log('Local: ', id, 'Global: ', globalId);

//state
const [selected, setSelected] = useState('');

const {user} = useAuth();

useEffect(() => {
    //async function fetchPolls
         const fetchPolls = async () => {    
            //supabase client 
            //single() to take only 1 item
            let { data, error } = await supabase
            .from('polls')
            .select('*')
            .eq('id', Number.parseInt(id))
            .single();
            if(error) {
             Alert.alert('Error fetching data');
            }
            setPoll(data);
        };

        //to fetch the user vote
        const fetchUserVote = async () => {    
            if (!user) {
                return;
            }
            //supabase client 
            //single() to take only 1 item
            let { data, error } = await supabase
            .from('votes')
            .select('*')
            .eq('poll_id', Number.parseInt(id))
            .eq('user_id', user.id)
            .limit(1)
            .single();
            
            setUserVote(data);
            //if there is some data so we can update the selected field using data.option
            //if the vote already exists
            if (data) {
                setSelected(data.option);
            }
        }; 
        
        fetchPolls();
        fetchUserVote();
        }, []);

//function
const vote = () => {
    const newVote = {
        option: selected, 
        poll_id: poll.id, 
        user_id: user?.id, 
    };
    if (userVote) {
      newVote.id = userVote.id;
    }
    const { data, error } = await supabase
     .from('votes')
     .upsert([newVote])  //if user has casted the vote already then only owner of the vote can also update the vote
     .select()
     .single();    
     if (error) {
        console.log(error);
        Alert.alert("Failed to vote"); 
     }  else {
        setUserVote(data);
        Alert.alert("Thank you for your vote");
     } 
   };

//if poll is not defined or if the poll is still loading and not loaded yet
if(!poll) {
return <ActivityIndicator /> //show a spinner to pretend loading behavior
}

    return (
         //to map through an array of options with limited items we'll not use FlatList
       //to render each item of array separately on UI
       //an option is an item of the array which is a string
       //for adjusting the header style we have used the 
    <View style= {styles.container}>
        <Stack.Screen options={{ title: 'Poll Voting'}} />

        <Text style= {styles.question}>{poll.question}</Text>
        <View style= {{gap: 5}}>
        {poll.options.map((option) => (
        //each child in the list should have a unique key prop 
        //expo vector icon e.g., check circle
        //View can't support onPress Event so use Pressable which works like a view with onPressEvent
         <Pressable 
         onPress={() => setSelected(option)}
         key= {option} 
         style={styles.optionContainer}
         >
          <Feather name={option === selected ? 'check-circle' : 'circle'} 
          size={18} 
          color={option === selected ? 'green' : 'gray'} 
          />
          <Text>{option}</Text>
          </Pressable>
          ))} 
        </View>

        <Button onPress={vote} title='Vote'/>
    </View>
    );
}

const styles= StyleSheet.create({
    container: {
        padding: 10,
        gap: 20,
    },
    question: {
        fontSize: 20,
        fontWeight: '600',
    },
    optionContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
})