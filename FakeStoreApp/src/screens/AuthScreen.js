import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { login, signup } from '../components/authSlice';

export default function AuthScreen() {
  const dispatch = useDispatch();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (isSignup) {
      if (!name || !email || !password) return Alert.alert('All fields are required');
      dispatch(signup({ name, email, password }));
    } else {
      if (!email || !password) return Alert.alert('Email and password are required');
      dispatch(login({ email, password }));
    }
  };

  const handleClear = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isSignup ? 'Sign up a new user' : 'Sign in'}</Text>

      {isSignup && (
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonRow}>
        <Button title="Clear" onPress={handleClear} />
        <Button title={isSignup ? 'Sign Up' : 'Sign In'} onPress={handleSubmit} />
      </View>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.toggleText}>
          {isSignup ? 'Already have an account? Click here to Sign In' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
  },
});
