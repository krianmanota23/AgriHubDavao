import { USER_ROLES } from '@/constants/user_roles';
import { db } from '@/firebaseConfig'; // Import your initialized db 
import { useRouter } from 'expo-router';
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveCurrentUser } from '../Database/UserData';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {


      const docRef = doc(db, "users", email.trim());
      getDoc(docRef).then((docSnap) => {

        if (docSnap.exists()) {
          // Document exists, access its data
          console.log("Document data:", docSnap.data());
          // You can also access the document ID
          console.log("Document ID:", docSnap.id);
          if(docSnap.data().password !== password) {
            Alert.alert('Login Failed', 'Incorrect password');
            setIsLoading(false);
            console.log('password mismatched!');
            
            return;
          } else {
            
            // Save current user session
            saveCurrentUser(docSnap.data().email);
            const url = USER_ROLES[docSnap.data().role as keyof typeof USER_ROLES]?.homepage;
            router.replace(url as any);
          }
        } else {
          // Document does not exist
          Alert.alert('Login Failed', 'No account found with this email address');
          setIsLoading(false);
          return;
        }
      })
      .catch((error) => {
        // Handle any errors during the fetch operation
        console.error("Error getting document:", error);
      });
      
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🌾</Text>
          </View>
          <Text style={styles.appName}>AgriHub Davao</Text>
        </View>
        <Text style={styles.title}>Login</Text>
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      {/* Register Link */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>register here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 24,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#A5D6A7',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});