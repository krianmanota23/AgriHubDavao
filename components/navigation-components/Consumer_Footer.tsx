import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ConsumerFooterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigation?: any;
  currentUser?: any;
  scrollViewRef?: any;
  currentScreen?: string;
}

const Consumer_Footer: React.FC<ConsumerFooterProps> = ({ 
  activeTab, 
  setActiveTab, 
  navigation, 
  currentUser, 
  scrollViewRef, 
  currentScreen 
}) => {
  const colors = {
    activeBackground: '#FFF3E0',
    activeText: '#FF9800',
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'Home') {
      const isOnHomeScreen = currentScreen === 'ConsumerHome';
      
      if (isOnHomeScreen && scrollViewRef && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      } else if (navigation) {
        navigation.navigate('ConsumerHome', { user: currentUser });
      }
    } else if (tab === 'Messages' && navigation) {
      navigation.navigate('MessagesScreen', { userRole: 'Consumer' });
    } else if (tab === 'Notifications' && navigation) {
      navigation.navigate('NotificationsScreen', { userRole: 'Consumer' });
    } else if (tab === 'Friends' && navigation) {
      navigation.navigate('FriendsScreen', { userRole: 'Consumer' });
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={[
          styles.footerButton, 
          activeTab === 'Home' && { backgroundColor: colors.activeBackground }
        ]}
        onPress={() => handleNavigation('Home')}
      >
        <Text style={[
          styles.footerButtonText, 
          activeTab === 'Home' && { color: colors.activeText, fontWeight: 'bold' }
        ]}>
          🏠 Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.footerButton, 
          activeTab === 'Messages' && { backgroundColor: colors.activeBackground }
        ]}
        onPress={() => handleNavigation('Messages')}
      >
        <Text style={[
          styles.footerButtonText, 
          activeTab === 'Messages' && { color: colors.activeText, fontWeight: 'bold' }
        ]}>
          💬 Messages
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.footerButton, 
          activeTab === 'Notifications' && { backgroundColor: colors.activeBackground }
        ]}
        onPress={() => handleNavigation('Notifications')}
      >
        <Text style={[
          styles.footerButtonText, 
          activeTab === 'Notifications' && { color: colors.activeText, fontWeight: 'bold' }
        ]}>
          🔔 Notifications
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.footerButton, 
          activeTab === 'Friends' && { backgroundColor: colors.activeBackground }
        ]}
        onPress={() => handleNavigation('Friends')}
      >
        <Text style={[
          styles.footerButtonText, 
          activeTab === 'Friends' && { color: colors.activeText, fontWeight: 'bold' }
        ]}>
          👥 Friends
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    paddingBottom: 25, // Extra padding for navigation bar
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerButtonText: {
    fontSize: 12,
    color: '#666',
  },
});

export default Consumer_Footer;
