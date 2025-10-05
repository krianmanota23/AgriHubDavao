import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  FlatList,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUser, clearCurrentUser, UserData } from '../../Database/UserData';
import Consumer_Footer from '../../../components/navigation-components/Consumer_Footer';

interface Post {
  id: number;
  status: 'Buying' | 'Selling';
  content: string;
  timestamp: string;
  reactions: number;
  comments: number;
}

const C_Profile: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Profile');
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.replace('/login');
      }
    };
    loadUser();
  }, []);

  // Create a navigation-like object for the footer component
  const navigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'ConsumerHome') {
        router.push('/consumer-home');
      } else if (screen === 'MessagesScreen') {
        router.push('/messages');
      } else if (screen === 'NotificationsScreen') {
        // TODO: Create notifications screen route
        Alert.alert('Coming Soon', 'Notifications feature is under development');
      } else if (screen === 'FriendsScreen') {
        router.push('/friends');
      }
    }
  };

  // Mock data for Consumer's own posts
  const myPosts: Post[] = [
    {
      id: 1,
      status: 'Buying',
      content: 'Looking for fresh vegetables for my restaurant. Need regular supply of carrots, potatoes, and onions.',
      timestamp: '3 hours ago',
      reactions: 5,
      comments: 2,
    },
    {
      id: 2,
      status: 'Buying',
      content: 'Need suppliers for organic vegetables. Prefer local farmers. Contact me for partnership opportunities.',
      timestamp: '5 hours ago',
      reactions: 12,
      comments: 4,
    },
    {
      id: 3,
      status: 'Buying',
      content: 'Looking for fresh fruits for my cafe. Need apples, oranges, and bananas. Weekly delivery preferred.',
      timestamp: '2 days ago',
      reactions: 8,
      comments: 3,
    },
  ];

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await clearCurrentUser();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{user?.userName || user?.firstName || 'Consumer'}</Text>
          <Text style={styles.userType}>Consumer</Text>
        </View>
        <View style={[styles.statusBadge, 
          { backgroundColor: item.status === 'Buying' ? '#2196F3' : '#FF9800' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.postContent}>{item.content}</Text>
      
      <View style={styles.postFooter}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        <View style={styles.postStats}>
          <Text style={styles.statText}>👍 {item.reactions}</Text>
          <Text style={styles.statText}>💭 {item.comments}</Text>
        </View>
      </View>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>👍</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            setSelectedPost(item);
            setShowCommentsModal(true);
          }}
        >
          <Text style={styles.actionText}>💭</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBurgerMenuItem = (title: string, onPress: () => void) => (
    <TouchableOpacity style={styles.burgerMenuItem} onPress={onPress}>
      <Text style={styles.burgerMenuText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Placeholder until you create C_Header component */}
      <View style={styles.headerPlaceholder}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setShowBurgerMenu(true)}>
          <Text style={styles.headerButton}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>🛒</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.userName || user?.firstName || 'Consumer'}</Text>
            <Text style={styles.profileRole}>Consumer</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{myPosts.length}</Text>
            <Text style={styles.statLabel}>Total Posts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {myPosts.reduce((sum, post) => sum + post.reactions, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Reactions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {myPosts.reduce((sum, post) => sum + post.comments, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Comments</Text>
          </View>
        </View>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>My Posts</Text>
          <FlatList
            data={myPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <Consumer_Footer 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigation={navigation}
        currentUser={user}
        currentScreen="Consumer_Profile"
      />

      {/* Burger Menu Modal */}
      <Modal
        visible={showBurgerMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBurgerMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.burgerMenu}>
            <View style={styles.burgerMenuHeader}>
              <Text style={styles.burgerMenuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setShowBurgerMenu(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {renderBurgerMenuItem('🏠 Home', () => {
              setShowBurgerMenu(false);
              router.push('/consumer-home');
            })}
            
            {renderBurgerMenuItem('⚙️ Settings', () => {
              setShowBurgerMenu(false);
              Alert.alert('Settings', 'Settings feature coming soon!');
            })}
            
            {renderBurgerMenuItem('👤 Profile Settings', () => {
              setShowBurgerMenu(false);
              router.push('/consumer-profile-settings');
            })}
            
            {renderBurgerMenuItem('🚪 Logout', () => {
              setShowBurgerMenu(false);
              handleLogout();
            })}
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={showCommentsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCommentsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.commentsModal}>
            <View style={styles.commentsModalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setShowCommentsModal(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedPost && (
              <View style={styles.postPreview}>
                <Text style={styles.postPreviewContent} numberOfLines={2}>
                  {selectedPost.content}
                </Text>
              </View>
            )}
            
            <ScrollView style={styles.commentsContainer}>
              <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>Green Valley Store</Text>
                  <Text style={styles.commentTime}>1 hour ago</Text>
                </View>
                <Text style={styles.commentText}>We have fresh vegetables available. Please contact us!</Text>
                <TouchableOpacity style={styles.replyButton}>
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>Fresh Mart</Text>
                  <Text style={styles.commentTime}>2 hours ago</Text>
                </View>
                <Text style={styles.commentText}>We can supply what you need. Check our profile for more info.</Text>
                <TouchableOpacity style={styles.replyButton}>
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            <View style={styles.commentInputSection}>
              <View style={styles.commentInputWrapper}>
                <Text style={styles.commentInputPlaceholder}>Write a comment...</Text>
              </View>
              <View style={styles.commentActions}>
                <TouchableOpacity style={styles.photoButton}>
                  <Text style={styles.photoButtonIcon}>📷</Text>
                  <Text style={styles.photoButtonText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendButton}>
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  headerPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50, // Extra padding for status bar
    backgroundColor: '#4CAF50',
  },
  headerButton: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#45a049',
  },
  profileImageText: {
    fontSize: 40,
    color: 'white',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  postsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  postContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userType: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  postStats: {
    flexDirection: 'row',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionText: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  burgerMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 50,
  },
  burgerMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  burgerMenuTitle: {
    fontSize: 20,
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
  commentsModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  commentsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  postPreview: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  postPreviewContent: {
    fontSize: 14,
    color: '#666',
  },
  commentsContainer: {
    maxHeight: 300,
  },
  commentItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentInputSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentInputWrapper: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
  },
  commentInputPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  photoButtonIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  photoButtonText: {
    fontSize: 14,
    color: '#666',
  },
  sendButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  replyButton: {
    marginTop: 5,
  },
  replyButtonText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default C_Profile;
