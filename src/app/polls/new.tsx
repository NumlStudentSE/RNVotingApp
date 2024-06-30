import { Redirect, Stack } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/src/providers/AuthProvider';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

export default function CreatePoll() {
    // To access data that the user is writing in the TextInput we need a State Variable
    const [question, setQuestion] = useState('');
    // State for dynamic options in which the state will be an array of strings
    const [options, setOptions] = useState(['', '']);
    const [error, setError] = useState('');

    const { user } = useAuth();
    const router = useRouter(); // Initialize the router

    const createPoll = async () => {
      setError('');
      if (!question) {
        setError('Please provide the question');
        return;
      }
      // Filter the options that are not empty strings
      const validOptions = options.filter(o => !!o);
      // ValidOptions are the options which are not empty
      if (validOptions.length < 2) {
        setError('Please provide at least 2 valid options');
        return;
      }

      const { data, error } = await supabase
        .from('polls')
        .insert([{ question, options: validOptions }])
        .select();
      if (error) {
        Alert.alert('Failed to create the poll');
        console.log(error);
        return;
      }
      router.back();
      console.warn('Poll created successfully');
    };

    // We will do guarding at layout level like if a user is not logged in so he will not be able to see the profile screen
    // User login info lies inside the provider in const {user}
    // If the user is not authenticated
    if (!user) {
      return <Redirect href="/login" />;
    }

    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Create Poll' }} />

        <Text style={styles.label}>Title</Text>
        <TextInput
          // To bind TextInput to state we use 2 properties: value and onChangeText
          value={question}
          onChangeText={setQuestion}
          placeholder="Type your question here"
          style={styles.input}
        />

        <Text style={styles.label}>Options</Text>
        {options.map((option, index) => (
          <View key={index} style={{ justifyContent: 'center' }}>
            <TextInput
              value={option}
              // To receive the text of the current TextInput of Options we use the text variable
              // To update the options with the value in the array through indexes
              // State is immutable so we can't update it directly
              onChangeText={(text) => {
                // Create a copy of the state options in another state updated
                const updated = [...options];
                // Text is the newly updated value of option
                updated[index] = text;
                setOptions(updated);
              }}
              placeholder={`Option ${index + 1}`}
              style={styles.input}
            />
            <Feather
              name="x"
              size={18}
              color="gray"
              onPress={() => {
                // Delete option based on index from array
                // Create a copy of the state options in another state updated
                const updated = [...options];
                // Remove the items from the array
                updated.splice(index, 1);
                setOptions(updated);
              }}
              style={{ position: 'absolute', right: 10 }}
            />
          </View>
        ))}
        <Button title="Add Option" onPress={() => setOptions([...options, ''])} />

        <Button title="Create Poll" onPress={createPoll} />
        <Text style={{ color: 'crimson' }}>{error}</Text>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 5,
  },
  label: {
    fontWeight: '500',
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
});
