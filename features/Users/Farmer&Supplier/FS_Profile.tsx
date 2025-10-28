import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FS_Footer from '../../../components/navigation-components/FS_Footer';
import { UserData, clearCurrentUser, getCurrentUser } from '../../Database/UserData';

// Types and Interfaces
interface Product {
  id: number;
  name: string;
  price: string;
}

interface Post {
  id: number;
  status: 'Selling' | 'Buying';
  content: string;
  timestamp: string;
  reactions: number;
  comments: number;
}

const FS_Profile: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Profile');
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Fresh Tomatoes', price: '45' },
    { id: 2, name: 'Organic Carrots', price: '35' },
    { id: 3, name: 'Premium Rice', price: '120' },
  ]);
  const [newProduct, setNewProduct] = useState<{ name: string; price: string }>({ name: '', price: '' });

  useEffect(() => {
    const loadCurrentUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
      } else {
        router.replace('/login');
      }
    };
    loadCurrentUser();
  }, []);

  // Create a navigation-like object for the footer component
  const navigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'FarmerSupplierHome') {
        router.push('/supplier-home');
      } else if (screen === 'MessagesScreen') {
        router.push('/messages');
      } else if (screen === 'NotificationsScreen') {
        Alert.alert('Coming Soon', 'Notifications feature is under development');
      } else if (screen === 'FriendsScreen') {
        router.push('/friends');
      }
    }
  };

  // Mock data for Farmer/Supplier's own posts (only Selling status)
  const myPosts: Post[] = [
    {
      id: 1,
      status: 'Selling',
      content: 'Fresh organic tomatoes available! 50kg ready for harvest. Best quality, competitive price. Contact for bulk orders.',
      timestamp: '1 hour ago',
      reactions: 18,
      comments: 8,
    },
    {
      id: 2,
      status: 'Selling',
      content: 'Rice harvest ready! 1000kg available. Premium quality, good price. Can deliver to nearby areas.',
      timestamp: '1 day ago',
      reactions: 25,
      comments: 10,
    },
    {
      id: 3,
      status: 'Selling',
      content: 'Fresh vegetables available! Carrots, cabbage, and lettuce. Best prices in town. Bulk orders welcome.',
      timestamp: '3 days ago',
      reactions: 15,
      comments: 6,
    },
  ];

  const handleUploadProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      price: newProduct.price,
    };
    
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '' });
    setShowUploadModal(false);
    Alert.alert('Success', 'Product uploaded successfully!');
  };

  const handleDeleteProduct = (productId: number) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setProducts(products.filter(p => p.id !== productId))
        },
      ]
    );
  };

  const handleEditProduct = (product: Product) => {
    setNewProduct({ name: product.name, price: product.price });
    setProducts(products.filter(p => p.id !== product.id));
    setShowUploadModal(true);
  };

  // Mock star rating for Farmer/Supplier (4.2 out of 5)
  const starRating = 4.2;
  const totalReviews = 28;

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
          <Text style={styles.authorName}>{currentUser?.userName || currentUser?.firstName || 'Farmer/Supplier'}</Text>
          <Text style={styles.userType}>Farmer/Supplier</Text>
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
      {/* Header - Placeholder */}
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
              <Text style={styles.profileImageText}>👤</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser?.userName || currentUser?.firstName || 'Farmer/Supplier'}</Text>
            <Text style={styles.profileRole}>Farmer/Supplier</Text>
            <Text style={styles.profileEmail}>{currentUser?.email || ''}</Text>
            
            {/* Star Rating */}
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={[
                    styles.star,
                    star <= Math.floor(starRating) ? styles.filledStar : styles.emptyStar
                  ]}>
                    {star <= Math.floor(starRating) ? '★' : '☆'}
                  </Text>
                ))}
              </View>
              <Text style={styles.ratingText}>{starRating} ({totalReviews} reviews)</Text>
            </View>
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

        {/* Product Showcase Section */}
        <View style={styles.productShowcaseSection}>
          <View style={styles.showcaseHeader}>
            <Text style={styles.showcaseTitle}>Product Showcase</Text>
            <Text style={styles.showcaseSubtitle}>Upload products to display on your profile</Text>
            
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => setShowUploadModal(true)}
            >
              <Text style={styles.uploadButtonIcon}>📷</Text>
              <Text style={styles.uploadButtonText}>Upload Product</Text>
            </TouchableOpacity>
            
            <View style={styles.arrowDown}>
              <Text style={styles.arrowText}>▼</Text>
            </View>
          </View>

          <Text style={styles.myProductsTitle}>My Products ({products.length})</Text>
          
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <View key={product.id} style={styles.productGridItem}>
                <View style={styles.productImagePlaceholder}>
                  <View style={styles.productActions}>
                    <TouchableOpacity 
                      style={styles.editIcon}
                      onPress={() => handleEditProduct(product)}
                    >
                      <Text style={styles.actionIconText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteIcon}
                      onPress={() => handleDeleteProduct(product.id)}
                    >
                      <Text style={styles.actionIconText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.productGridName}>{product.name}</Text>
                <Text style={styles.productGridPrice}>₱{product.price}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>My Posts ({myPosts.length})</Text>
          <FlatList
            data={myPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <FS_Footer 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navigation={navigation}
        currentUser={currentUser}
        currentScreen="FS_Profile"
      />

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
              router.push('/supplier-home');
            })}
            
            {renderBurgerMenuItem('⚙️ Settings', () => {
              setShowBurgerMenu(false);
              Alert.alert('Settings', 'Settings feature coming soon!');
            })}
            
            {renderBurgerMenuItem('👤 Profile Settings', () => {
              setShowBurgerMenu(false);
              router.push('/fs-profile-settings');
            })}
            
            {renderBurgerMenuItem('🚪 Logout', () => {
              setShowBurgerMenu(false);
              handleLogout();
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Upload Product Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.uploadModalOverlay}>
          <View style={styles.uploadModalContent}>
            <View style={styles.uploadModalHeader}>
              <Text style={styles.uploadModalTitle}>Upload Product</Text>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                <Text style={styles.uploadModalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.uploadForm}>
              <Text style={styles.inputLabel}>Product Name</Text>
              <TextInput
                style={styles.textInput}
                value={newProduct.name}
                onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                placeholder="Enter product name"
                placeholderTextColor="#999"
              />
              
              <Text style={styles.inputLabel}>Price (₱)</Text>
              <TextInput
                style={styles.textInput}
                value={newProduct.price}
                onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                placeholder="Enter price"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Product Image *</Text>
              <TouchableOpacity 
                style={styles.photoUploadButton}
                onPress={() => Alert.alert('Photo Upload', 'Photo upload feature coming soon!')}
              >
                <Text style={styles.photoUploadIcon}>📸</Text>
                <Text style={styles.photoUploadText}>Add Photo</Text>
              </TouchableOpacity>
              
              <View style={styles.uploadModalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowUploadModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleUploadProduct}
                >
                  <Text style={styles.saveButtonText}>Save Product</Text>
                </TouchableOpacity>
              </View>
            </View>
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
              <Text style={styles.commentsModalTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setShowCommentsModal(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentsContainer}>
              <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>Store Owner A</Text>
                  <Text style={styles.commentTime}>1 hour ago</Text>
                </View>
                <Text style={styles.commentText}>Interested in your products! Can we discuss pricing?</Text>
                <TouchableOpacity style={styles.replyButton}>
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>Customer B</Text>
                  <Text style={styles.commentTime}>30 min</Text>
                </View>
                <Text style={styles.commentText}>Looking forward to your next harvest!</Text>
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  star: {
    fontSize: 20,
  },
  filledStar: {
    color: '#FFD700',
  },
  emptyStar: {
    color: '#E0E0E0',
  },
  ratingText: {
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
    right: 0,
    width: 280,
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  // Product Showcase Styles
  productShowcaseSection: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  showcaseHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  showcaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  showcaseSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  uploadButtonIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoUploadButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF9800',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  photoUploadIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  photoUploadText: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: '600',
  },
  arrowDown: {
    marginTop: 10,
  },
  arrowText: {
    fontSize: 20,
    color: '#FF9800',
  },
  myProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productGridItem: {
    width: '48%',
    marginBottom: 15,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    position: 'relative',
    marginBottom: 8,
  },
  productActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  editIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  deleteIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconText: {
    fontSize: 14,
  },
  productGridName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  productGridPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  // Upload Modal Styles
  uploadModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadModalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  uploadModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  uploadModalClose: {
    fontSize: 24,
    color: '#666',
  },
  uploadForm: {
    gap: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  uploadModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 0.45,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 0.45,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
  commentsModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  commentsContainer: {
    maxHeight: 400,
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

export default FS_Profile;
