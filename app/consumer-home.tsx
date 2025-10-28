import { getCurrentUser, UserData } from '@/features/Database/UserData';
import Consumer_HomeScreen from '@/features/Users/Consumer/Consumer_HomeScreen';
import { useRouter } from 'expo-router';
import 'expo-router/entry';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function ConsumerHomeRoute() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // No user logged in, redirect to login
      router.replace('/');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  // Create mock navigation object for Consumer_HomeScreen
  const mockNavigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'Login') {
        router.replace('/');
      } else if (screen === 'C_Profile') {
        router.push('/c-profile');
      } else if (screen === 'Consumer_ProfileSettings') {
        router.push('/consumer-profile-settings');
      } else if (screen === 'MessagesScreen') {
        router.push('/messages');
      } else if (screen === 'NotificationsScreen') {
        // TODO: Create notifications screen
        console.log('Navigate to NotificationsScreen:', params);
      } else if (screen === 'FriendsScreen') {
        router.push('/friends');
      } else if (screen === 'StoreOwnerProfileView') {
        // TODO: Create store owner profile view
        console.log('Navigate to StoreOwnerProfileView:', params);
      } else {
        console.log('Navigate to:', screen, params);
      }
    },
    goBack: () => router.back(),
    addListener: () => () => {}, // Return unsubscribe function
  };

  const mockRoute = {
    params: {
      user: user,
    },
  };

  return <Consumer_HomeScreen route={mockRoute} navigation={mockNavigation} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
