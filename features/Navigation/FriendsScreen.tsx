import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { getCurrentUser, clearCurrentUser, UserData } from '../Database/UserData';
import Consumer_Footer from '../../components/navigation-components/Consumer_Footer';
import FS_Footer from '../../components/navigation-components/FS_Footer';
import StoreO_Footer from '../../components/navigation-components/StoreO_Footer';

interface Friend {
  id: number;
  name: string;
  userType: string;
  avatar: string;
  status: string;
  lastInteraction: string;
}

interface FriendRequest {
  id: number;
  name: string;
  userType: string;
  avatar: string;
  message: string;
}

interface FriendsScreenProps {
  route: {
    params: {
      userRole: string;
    };
  };
  navigation: any;
}

const FriendsScreen: React.FC<FriendsScreenProps> = ({ route, navigation }) => {
  const { userRole } = route.params;
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Friends');
  const [tabSelection, setTabSelection] = useState<string>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
        loadFriendsData(userData.role);
      }
    };
    loadCurrentUser();
  }, []);

  const loadFriendsData = (role: string) => {
    let mockFriends: Friend[] = [];
    let mockRequests: FriendRequest[] = [];
    
    if (role === 'Farmer/Supplier') {
      mockFriends = [
        {
          id: 1,
          name: 'Green Valley Store',
          userType: 'Store Owner',
          avatar: '🏪',
          status: 'Active buyer',
          lastInteraction: '2 hours ago',
        },
        {
          id: 2,
          name: 'Fresh Mart',
          userType: 'Store Owner',
          avatar: '🏪',
          status: 'Regular customer',
          lastInteraction: '1 day ago',
        },
        {
          id: 3,
          name: 'City Grocery',
          userType: 'Store Owner',
          avatar: '🏪',
          status: 'Bulk orders',
          lastInteraction: '3 days ago',
        },
      ];
      
      mockRequests = [
        {
          id: 1,
          name: 'Metro Store',
          userType: 'Store Owner',
          avatar: '🏪',
          message: 'Wants to connect for vegetable supply',
        },
        {
          id: 2,
          name: 'Super Market',
          userType: 'Store Owner',
          avatar: '🏪',
          message: 'Interested in your rice products',
        },
      ];
    } else if (role === 'Store Owner') {
      mockFriends = [
        {
          id: 1,
          name: 'Francis Manibad',
          userType: 'Farmer/Supplier',
          avatar: '🌾',
          status: 'Vegetable supplier',
          lastInteraction: '1 hour ago',
        },
        {
          id: 2,
          name: 'Juan Dela Cruz',
          userType: 'Farmer/Supplier',
          avatar: '🌾',
          status: 'Rice supplier',
          lastInteraction: '4 hours ago',
        },
        {
          id: 3,
          name: 'Maria Santos',
          userType: 'Consumer',
          avatar: '👤',
          status: 'Regular customer',
          lastInteraction: '2 days ago',
        },
        {
          id: 4,
          name: 'Carlos Rivera',
          userType: 'Consumer',
          avatar: '👤',
          status: 'Frequent buyer',
          lastInteraction: '1 week ago',
        },
      ];
      
      mockRequests = [
        {
          id: 1,
          name: 'Pedro Santos',
          userType: 'Farmer/Supplier',
          avatar: '🌾',
          message: 'Wants to supply fresh fruits',
        },
        {
          id: 2,
          name: 'Ana Cruz',
          userType: 'Consumer',
          avatar: '👤',
          message: 'Wants to follow your store updates',
        },
      ];
    } else if (role === 'Consumer') {
      mockFriends = [
        {
          id: 1,
          name: 'Manota Store',
          userType: 'Store Owner',
          avatar: '🏪',
          status: 'Favorite store',
          lastInteraction: '30 minutes ago',
        },
        {
          id: 2,
          name: 'Green Valley Store',
          userType: 'Store Owner',
          avatar: '🏪',
          status: 'Fresh vegetables',
          lastInteraction: '2 hours ago',
        },
        {
          id: 3,
          name: 'City Market',
          userType: 'Store Owner',
          avatar: '🏪',
          status: 'Good prices',
          lastInteraction: '1 day ago',
        },
      ];
      
      mockRequests = [
        {
          id: 1,
          name: 'Fresh Mart',
          userType: 'Store Owner',
          avatar: '🏪',
          message: 'Wants to send you store updates',
        },
        {
          id: 2,
          name: 'Organic Store',
          userType: 'Store Owner',
          avatar: '🏪',
          message: 'Invites you to follow their products',
        },
      ];
    }
    
    setFriends(mockFriends);
    setFriendRequests(mockRequests);
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

  const acceptFriendRequest = (requestId: number) => {
    const request = friendRequests.find(req => req.id === requestId);
    if (request) {
      setFriends([...friends, {
        ...request,
        status: 'New connection',
        lastInteraction: 'Just now',
      }]);
      setFriendRequests(friendRequests.filter(req => req.id !== requestId));
      Alert.alert('Success', `You are now connected with ${request.name}`);
    }
  };

  const declineFriendRequest = (requestId: number) => {
    const request = friendRequests.find(req => req.id === requestId);
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    if (request) {
      Alert.alert('Declined', `Friend request from ${request.name} declined`);
    }
  };

  const removeFriend = (friendId: number) => {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;
    
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friend.name} from your connections?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setFriends(friends.filter(f => f.id !== friendId));
            Alert.alert('Removed', `${friend.name} has been removed from your connections`);
          }
        },
      ]
    );
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendAvatar}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      
      <View style={styles.friendContent}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendType}>{item.userType}</Text>
        <Text style={[styles.friendStatus, { color: getHeaderColor() }]}>{item.status}</Text>
        <Text style={styles.lastInteraction}>Last interaction: {item.lastInteraction}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFriend(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFriendRequest = ({ item }: { item: FriendRequest }) => (
    <View style={styles.requestItem}>
      <View style={styles.friendAvatar}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      
      <View style={styles.requestContent}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendType}>{item.userType}</Text>
        <Text style={styles.requestMessage}>{item.message}</Text>
      </View>
      
      <View style={styles.requestButtons}>
        <TouchableOpacity 
          style={[styles.acceptButton, { backgroundColor: getHeaderColor() }]}
          onPress={() => acceptFriendRequest(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.declineButton}
          onPress={() => declineFriendRequest(item.id)}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (userRole === 'Consumer') {
      return (
        <Consumer_Footer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navigation={navigation}
          currentUser={currentUser}
          currentScreen="FriendsScreen"
        />
      );
    } else if (userRole === 'Farmer/Supplier') {
      return (
        <FS_Footer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navigation={navigation}
          currentUser={currentUser}
          currentScreen="FriendsScreen"
        />
      );
    } else if (userRole === 'Store Owner') {
      return (
        <StoreO_Footer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navigation={navigation}
          currentUser={currentUser}
          currentScreen="FriendsScreen"
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
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity onPress={() => setShowBurgerMenu(true)}>
          <Text style={styles.burgerButton}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, tabSelection === 'friends' && styles.activeTab]}
          onPress={() => setTabSelection('friends')}
        >
          <Text style={[styles.tabText, tabSelection === 'friends' && { color: getHeaderColor(), fontWeight: 'bold' }]}>
            Friends ({friends.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, tabSelection === 'requests' && styles.activeTab]}
          onPress={() => setTabSelection('requests')}
        >
          <Text style={[styles.tabText, tabSelection === 'requests' && { color: getHeaderColor(), fontWeight: 'bold' }]}>
            Requests ({friendRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {tabSelection === 'friends' ? (
        <FlatList
          data={friends}
          renderItem={renderFriend}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={friendRequests}
          renderItem={renderFriendRequest}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  friendItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  requestItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
  },
  friendContent: {
    flex: 1,
  },
  requestContent: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  friendType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  friendStatus: {
    fontSize: 14,
    marginBottom: 2,
  },
  lastInteraction: {
    fontSize: 12,
    color: '#999',
  },
  requestMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  requestButtons: {
    flexDirection: 'column',
    gap: 5,
  },
  acceptButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  declineButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  declineButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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

export default FriendsScreen;
