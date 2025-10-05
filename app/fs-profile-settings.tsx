import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUser, UserData } from '@/features/Database/UserData';
import FS_ProfileSettings from '@/features/Settings/FS_ProfileSettings';

export default function FSProfileSettingsRoute() {
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

  // Create mock navigation object
  const mockNavigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'Login') {
        router.replace('/');
      } else if (screen === 'FarmerSupplierHome') {
        router.back();
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

  return <FS_ProfileSettings route={mockRoute} navigation={mockNavigation} />;
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
