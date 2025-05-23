import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, signup, logout, updateProfile } from '../components/authSlice';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user, loggedIn, error } = useSelector((state) => state.auth);

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUpdatedName(user.name || '');
      setUpdatedEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async () => {
    if (isSignup) {
      if (!name || !email || !password) return;
    } else {
      if (!email || !password) return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        await dispatch(signup({ name, email, password }));
      } else {
        await dispatch(login({ email, password }));
      }
    } finally {
      setLoading(false);
    }
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleUpdate = () => {
    if (!updatedName || !updatedEmail || !updatedPassword) return;
    dispatch(updateProfile({ name: updatedName, email: updatedEmail, password: updatedPassword }));
    setUpdateModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!loggedIn || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{isSignup ? 'Sign Up' : 'Sign In'}</Text>

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

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonRow}>
          <Button title={isSignup ? 'Sign Up' : 'Sign In'} onPress={handleSubmit} disabled={loading} />
        </View>

        <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
          <Text style={styles.toggleText}>
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      <Text style={styles.info}>Name: {user?.name || 'N/A'}</Text>
      <Text style={styles.info}>Email: {user?.email || 'N/A'}</Text>

      <Button title="Update Profile" onPress={() => setUpdateModalVisible(true)} />
      <View style={{ marginTop: 10 }}>
        <Button title="Sign Out" color="red" onPress={() => dispatch(logout())} />
      </View>

      <Modal visible={updateModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Update Profile</Text>
            <TextInput
              placeholder="New Name"
              style={styles.input}
              value={updatedName}
              onChangeText={setUpdatedName}
            />
            <TextInput
              placeholder="New Email"
              style={styles.input}
              value={updatedEmail}
              onChangeText={setUpdatedEmail}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="New Password"
              style={styles.input}
              value={updatedPassword}
              onChangeText={setUpdatedPassword}
              secureTextEntry
            />
            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={() => setUpdateModalVisible(false)} />
              <Button title="Confirm" onPress={handleUpdate} />
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  toggleText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 15,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
});