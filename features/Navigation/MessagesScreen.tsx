import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Consumer_Footer from '../../components/navigation-components/Consumer_Footer';
import FS_Footer from '../../components/navigation-components/FS_Footer';
import StoreO_Footer from '../../components/navigation-components/StoreO_Footer';
import { clearCurrentUser, getCurrentUser, UserData } from '../Database/UserData';

interface Conversation {
  id: number;
  name: string;
  userType: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
}

interface MessagesScreenProps {
  route: {
    params: {
      userRole: string;
    };
  };
  navigation: any;
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({ route, navigation }) => {
  const { userRole } = route.params;
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeTab, setActiveTab] = useState<string>('Messages');
  const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
        loadConversations(userData.role);
      }
    };
    loadCurrentUser();
  }, []);

  const loadConversations = (role: string) => {
    let mockConversations: Conversation[] = [];
    
    if (role === 'Farmer/Supplier') {
      mockConversations = [
        {
          id: 1,
          name: 'Green Valley Store',
          userType: 'Store Owner',
          lastMessage: 'Are your tomatoes still available?',
          timestamp: '2 min ago',
          unreadCount: 2,
          avatar: '🏪',
        },
        {
          id: 2,
          name: 'Fresh Mart',
          userType: 'Store Owner',
          lastMessage: 'Thanks for the quality rice!',
          timestamp: '1 hour ago',
          unreadCount: 0,
          avatar: '🏪',
        },
        {
          id: 3,
          name: 'City Grocery',
          userType: 'Store Owner',
          lastMessage: 'Can you deliver 50kg carrots tomorrow?',
          timestamp: '3 hours ago',
          unreadCount: 1,
          avatar: '🏪',
        },
      ];
    } else if (role === 'Store Owner') {
      mockConversations = [
        {
          id: 1,
          name: 'Francis Manibad',
          userType: 'Farmer/Supplier',
          lastMessage: 'Fresh vegetables ready for pickup',
          timestamp: '5 min ago',
          unreadCount: 1,
          avatar: '🌾',
        },
        {
          id: 2,
          name: 'Maria Santos',
          userType: 'Consumer',
          lastMessage: 'Do you have organic tomatoes?',
          timestamp: '30 min ago',
          unreadCount: 0,
          avatar: '👤',
        },
        {
          id: 3,
          name: 'Juan Dela Cruz',
          userType: 'Farmer/Supplier',
          lastMessage: 'Rice harvest is ready',
          timestamp: '2 hours ago',
          unreadCount: 3,
          avatar: '🌾',
        },
      ];
    } else if (role === 'Consumer') {
      mockConversations = [
        {
          id: 1,
          name: 'Manota Store',
          userType: 'Store Owner',
          lastMessage: 'Your order is ready for pickup',
          timestamp: '10 min ago',
          unreadCount: 1,
          avatar: '🏪',
        },
        {
          id: 2,
          name: 'Green Valley Store',
          userType: 'Store Owner',
          lastMessage: 'We have fresh vegetables today',
          timestamp: '1 hour ago',
          unreadCount: 0,
          avatar: '🏪',
        },
        {
          id: 3,
          name: 'City Market',
          userType: 'Store Owner',
          lastMessage: 'Special discount on rice today!',
          timestamp: '4 hours ago',
          unreadCount: 2,
          avatar: '🏪',
        },
      ];
    }
    
    setConversations(mockConversations);
  };

  const handleLogout = async () => {
    await clearCurrentUser();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const getHeaderColor = () => {
    switch (userRole) {
      case 'Store Owner':
        return '#2196F3';
      case 'Consumer':
        return '#FF9800';
      default: // Farmer/Supplier
        return '#4CAF50';
    }
  };

  const renderBurgerMenuItem = (title: string, onPress: () => void) => (
    <TouchableOpacity style={styles.burgerMenuItem} onPress={onPress}>
      <Text style={styles.burgerMenuText}>{title}</Text>
    </TouchableOpacity>
  );

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => navigation.navigate('ChatScreen', { 
        conversation: item, 
        currentUser: currentUser 
      })}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.avatar}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.userType}>{item.userType}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (userRole === 'Consumer') {
      return (
        <Consumer_Footer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navigation={navigation}
          currentUser={currentUser}
          currentScreen="MessagesScreen"
        />
      );
    } else if (userRole === 'Farmer/Supplier') {
      return (
        <FS_Footer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navigation={navigation}
          currentUser={currentUser}
          currentScreen="MessagesScreen"
        />
      );
    } else if (userRole === 'Store Owner') {
      return (
        <StoreO_Footer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navigation={navigation}
          currentUser={currentUser}
          currentScreen="MessagesScreen"
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: getHeaderColor() }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={() => setShowBurgerMenu(true)}>
          <Text style={styles.burgerButton}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id.toString()}
        style={styles.conversationsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer Navigation */}
      {renderFooter()}

      {/* Burger Menu Modal */}
      <Modal
        visible={showBurgerMenu}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowBurgerMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowBurgerMenu(false)}
        >
          <View style={styles.burgerMenu}>
            <View style={styles.burgerMenuHeader}>
              <Text style={styles.burgerMenuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setShowBurgerMenu(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {renderBurgerMenuItem('🏠 Home', () => {
              setShowBurgerMenu(false);
              if (userRole === 'Farmer/Supplier') {
                navigation.navigate('FarmerSupplierHome', { user: currentUser });
              } else if (userRole === 'Store Owner') {
                navigation.navigate('StoreOwnerHome', { user: currentUser });
              } else if (userRole === 'Consumer') {
                navigation.navigate('ConsumerHome', { user: currentUser });
              }
            })}
            
            {renderBurgerMenuItem('👤 Profile', () => {
              setShowBurgerMenu(false);
              if (userRole === 'Farmer/Supplier') {
                navigation.navigate('FS_Profile', { user: currentUser });
              } else if (userRole === 'Store Owner') {
                navigation.navigate('SO_Profile', { user: currentUser });
              } else if (userRole === 'Consumer') {
                navigation.navigate('C_Profile', { user: currentUser });
              }
            })}
            
            {renderBurgerMenuItem('⚙️ Settings', () => {
              setShowBurgerMenu(false);
              Alert.alert('Settings', 'Settings feature coming soon!');
            })}
            
            {renderBurgerMenuItem('🚪 Logout', () => {
              setShowBurgerMenu(false);
              handleLogout();
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 20,
  },
  backButton: {
    fontSize: 24,
    color: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  burgerButton: {
    fontSize: 24,
    color: 'white',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    fontSize: 40,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  userType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  burgerMenu: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  burgerMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  burgerMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  burgerMenuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  burgerMenuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MessagesScreen;
