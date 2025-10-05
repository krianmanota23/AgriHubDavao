import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ConsumerHeaderProps {
  onBurgerPress?: () => void;
  onBackPress?: () => void;
}

const Consumer_Header: React.FC<ConsumerHeaderProps> = ({ onBurgerPress, onBackPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.spacer}></View>
      <View style={styles.titleContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🛒</Text>
        </View>
        <Text style={styles.headerTitle}>AgriHub Davao</Text>
      </View>
      <TouchableOpacity 
        style={styles.burgerButton}
        onPress={onBurgerPress}
      >
        <Text style={styles.burgerIcon}>☰</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 20, // Add extra padding for status bar
  },
  backButton: {
    padding: 5,
    width: 30,
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logo: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  burgerButton: {
    padding: 5,
    width: 30,
    alignItems: 'center',
  },
  burgerIcon: {
    fontSize: 24,
    color: 'white',
  },
  spacer: {
    width: 30,
    height: 30,
  },
});

export default Consumer_Header;
