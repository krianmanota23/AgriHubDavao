import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { getCurrentUser, clearCurrentUser, UserData } from '../Database/UserData';
import Consumer_Footer from '../../components/navigation-components/Consumer_Footer';
import FS_Footer from '../../components/navigation-components/FS_Footer';
import StoreO_Footer from '../../components/navigation-components/StoreO_Footer';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  icon: string;
  isRead: boolean;
}

interface NotificationsScreenProps {
  route: {
    params: {
      userRole: string;
    };
  };
  navigation: any;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ route, navigation }) => {
  const { userRole } = route.params;
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<string>('Notifications');
  const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
        loadNotifications(userData.role);
      }
    };
    loadCurrentUser();
  }, []);

  const loadNotifications = (role: string) => {
    let mockNotifications: Notification[] = [];
    
    if (role === 'Farmer/Supplier') {
      mockNotifications = [
        {
          id: 1,
          type: 'like',
          title: 'Green Valley Store liked your post',
          message: 'Your post about "Fresh organic tomatoes available!" received a like',
          timestamp: '5 minutes ago',
          icon: '👍',
          isRead: false,
        },
        {
          id: 2,
          type: 'comment',
          title: 'Fresh Mart commented on your post',
          message: 'Great quality rice! When will the next batch be ready?',
          timestamp: '1 hour ago',
          icon: '💭',
          isRead: false,
        },
        {
          id: 3,
          type: 'message',
          title: 'New message from City Grocery',
          message: 'Can you deliver 50kg carrots tomorrow?',
          timestamp: '3 hours ago',
          icon: '💬',
          isRead: true,
        },
        {
          id: 4,
          type: 'like',
          title: 'Metro Store liked your post',
          message: 'Your post about "Rice harvest ready!" received a like',
          timestamp: '1 day ago',
          icon: '👍',
          isRead: true,
        },
        {
          id: 5,
          type: 'order',
          title: 'New order inquiry',
          message: 'Fresh Mart is interested in your vegetables',
          timestamp: '2 days ago',
          icon: '📦',
          isRead: true,
        },
      ];
    } else if (role === 'Store Owner') {
      mockNotifications = [
        {
          id: 1,
          type: 'like',
          title: 'Maria Santos liked your post',
          message: 'Your post about "Fresh vegetables available!" received a like',
          timestamp: '10 minutes ago',
          icon: '👍',
          isRead: false,
        },
        {
          id: 2,
          type: 'comment',
          title: 'Francis Manibad commented on your post',
          message: 'I can supply you with fresh tomatoes weekly',
          timestamp: '30 minutes ago',
          icon: '💭',
          isRead: false,
        },
        {
          id: 3,
          type: 'message',
          title: 'New message from Juan Dela Cruz',
          message: 'Rice harvest is ready for your store',
          timestamp: '2 hours ago',
          icon: '💬',
          isRead: true,
        },
        {
          id: 4,
          type: 'order',
          title: 'Order update',
          message: 'Your vegetable order is ready for pickup',
          timestamp: '5 hours ago',
          icon: '📦',
          isRead: true,
        },
        {
          id: 5,
          type: 'like',
          title: 'Carlos Rivera liked your post',
          message: 'Your post about "Special discount today!" received a like',
          timestamp: '1 day ago',
          icon: '👍',
          isRead: true,
        },
      ];
    } else if (role === 'Consumer') {
      mockNotifications = [
        {
          id: 1,
          type: 'order',
          title: 'Order ready for pickup',
          message: 'Your order from Manota Store is ready',
          timestamp: '15 minutes ago',
          icon: '📦',
          isRead: false,
        },
        {
          id: 2,
          type: 'like',
          title: 'Manota Store liked your comment',
          message: 'Your comment on their post received a like',
          timestamp: '1 hour ago',
          icon: '👍',
          isRead: false,
        },
        {
          id: 3,
          type: 'message',
          title: 'New message from Green Valley Store',
          message: 'We have fresh vegetables today',
          timestamp: '2 hours ago',
          icon: '💬',
          isRead: true,
        },
        {
          id: 4,
          type: 'discount',
          title: 'Special offer available',
          message: 'City Market has 20% off on rice today!',
          timestamp: '4 hours ago',
          icon: '🏷️',
          isRead: true,
        },
        {
          id: 5,
          type: 'comment',
          title: 'Fresh Mart replied to your comment',
          message: 'Thank you for your feedback!',
          timestamp: '1 day ago',
          icon: '💭',
          isRead: true,
        },
      ];
    }
    
    setNotifications(mockNotifications);
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

  const markAsRead = (notificationId: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIcon}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      
      {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: getHeaderColor() }]} />}
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderFooter = () => {
    if (userRole === 'Consumer') {
      return (
        <Consumer_Footer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navigation={navigation}
          currentUser={currentUser}
          currentScreen="NotificationsScreen"
        />
      );
    } else if (userRole === 'Farmer/Supplier') {
      return (
        <FS_Footer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navigation={navigation}
          currentUser={currentUser}
          currentScreen="NotificationsScreen"
        />
      );
    } else if (userRole === 'Store Owner') {
      return (
        <StoreO_Footer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navigation={navigation}
          currentUser={currentUser}
          currentScreen="NotificationsScreen"
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setShowBurgerMenu(true)}>
            <Text style={styles.burgerButton}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        style={styles.notificationsList}
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
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  unreadBadge: {
    backgroundColor: '#FF5722',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  burgerButton: {
    fontSize: 24,
    color: 'white',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  unreadNotification: {
    backgroundColor: '#f8f9ff',
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 10,
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

export default NotificationsScreen;
