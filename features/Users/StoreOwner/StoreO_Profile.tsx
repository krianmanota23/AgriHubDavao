import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
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
import StoreO_Footer from '../../../components/navigation-components/StoreO_Footer';
import { UserData, clearCurrentUser, getCurrentUser } from '../../Database/UserData';

interface Product {
  id: number;
  name: string;
  price: string;
  image: { uri: string };
  dateAdded: string;
}

interface Post {
  id: number;
  status: 'Selling' | 'Buying';
  content: string;
  timestamp: string;
  reactions: number;
  comments: number;
}

const StoreO_Profile: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Profile');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductsExpanded, setIsProductsExpanded] = useState<boolean>(true);
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [uploadedProducts, setUploadedProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: '45',
      image: { uri: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Fresh+Tomatoes' },
      dateAdded: '1/15/2024'
    },
    {
      id: 2,
      name: 'Organic Carrots',
      price: '35',
      image: { uri: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Organic+Carrots' },
      dateAdded: '1/14/2024'
    },
    {
      id: 3,
      name: 'Premium Rice',
      price: '120',
      image: { uri: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Premium+Rice' },
      dateAdded: '1/13/2024'
    }
  ]);
  const [newProduct, setNewProduct] = useState<{
    name: string;
    price: string;
    image: { uri: string } | null;
  }>({
    name: '',
    price: '',
    image: null
  });

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
      if (screen === 'StoreOwnerHome') {
        router.push('/store-owner-home');
      } else if (screen === 'MessagesScreen') {
        router.push('/messages');
      } else if (screen === 'NotificationsScreen') {
        Alert.alert('Coming Soon', 'Notifications feature is under development');
      } else if (screen === 'FriendsScreen') {
        router.push('/friends');
      }
    }
  };

  // Mock data for Store Owner's own posts
  const myPosts: Post[] = [
    {
      id: 1,
      status: 'Selling',
      content: 'Fresh organic vegetables available! Carrots, cabbage, and lettuce. Best prices in town. Bulk orders welcome.',
      timestamp: '2 hours ago',
      reactions: 15,
      comments: 6,
    },
    {
      id: 2,
      status: 'Buying',
      content: 'Looking for fresh vegetables and fruits. Need 50kg of tomatoes and 30kg of potatoes. Contact me for pricing.',
      timestamp: '1 day ago',
      reactions: 12,
      comments: 5,
    },
    {
      id: 3,
      status: 'Selling',
      content: 'Quality rice and corn available at competitive prices. Bulk orders preferred. Delivery available.',
      timestamp: '3 days ago',
      reactions: 8,
      comments: 3,
    },
  ];

  const starRating = 4.5;
  const totalReviews = 42;

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
        }
      ]
    );
  };

  const handleProductUpload = () => {
    Alert.alert(
      'Upload Product Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openProductCamera() },
        { text: 'Gallery', onPress: () => openProductGallery() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openProductCamera = () => {
    const mockImage = {
      uri: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Product+Photo',
    };
    setNewProduct({ ...newProduct, image: mockImage });
    Alert.alert('Success', 'Product photo captured!');
  };

  const openProductGallery = () => {
    const mockImage = {
      uri: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Product+Photo',
    };
    setNewProduct({ ...newProduct, image: mockImage });
    Alert.alert('Success', 'Product photo selected!');
  };

  const submitProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      Alert.alert('Error', 'Please fill in all fields and upload an image');
      return;
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      price: newProduct.price,
      image: newProduct.image,
      dateAdded: new Date().toLocaleDateString()
    };

    setUploadedProducts([...uploadedProducts, product]);
    setNewProduct({ name: '', price: '', image: null });
    setShowUploadModal(false);
    Alert.alert('Success', 'Product uploaded successfully!');
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      image: product.image
    });
    setShowEditModal(true);
  };

  const updateProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image || !editingProduct) {
      Alert.alert('Error', 'Please fill in all fields and upload an image');
      return;
    }

    const updatedProducts = uploadedProducts.map(product => 
      product.id === editingProduct.id 
        ? { ...product, name: newProduct.name, price: newProduct.price, image: newProduct.image! }
        : product
    );

    setUploadedProducts(updatedProducts);
    setNewProduct({ name: '', price: '', image: null });
    setEditingProduct(null);
    setShowEditModal(false);
    Alert.alert('Success', 'Product updated successfully!');
  };

  const deleteProduct = (productId: number) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setUploadedProducts(uploadedProducts.filter(p => p.id !== productId));
            Alert.alert('Success', 'Product deleted successfully!');
          }
        }
      ]
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{currentUser?.storeName || currentUser?.userName || currentUser?.firstName || 'Store Owner'}</Text>
          <Text style={styles.userType}>Store Owner</Text>
          {currentUser?.storeName && <Text style={styles.storeName}>{currentUser?.userName || currentUser?.firstName}</Text>}
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
      {/* Header */}
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
              <Text style={styles.profileImageText}>🏪</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser?.storeName || currentUser?.userName || currentUser?.firstName || 'Store Owner'}</Text>
            <Text style={styles.profileRole}>Store Owner</Text>
            {currentUser?.storeName && <Text style={styles.storeOwnerName}>{currentUser?.userName || currentUser?.firstName}</Text>}
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
        <View style={styles.uploadSection}>
          <Text style={styles.uploadSectionTitle}>Product Showcase</Text>
          <Text style={styles.uploadSectionSubtitle}>Upload products to display on your profile</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={() => setShowUploadModal(true)}>
            <Text style={styles.uploadIcon}>📸</Text>
            <Text style={styles.uploadText}>Upload Product</Text>
          </TouchableOpacity>
          
          {/* Expand/Collapse Toggle */}
          {uploadedProducts.length > 0 && (
            <TouchableOpacity 
              style={styles.expandToggle}
              onPress={() => setIsProductsExpanded(!isProductsExpanded)}
            >
              <Text style={styles.expandArrow}>{isProductsExpanded ? '▼' : '▲'}</Text>
            </TouchableOpacity>
          )}

          {/* Display Uploaded Products */}
          {uploadedProducts.length > 0 && isProductsExpanded && (
            <View style={styles.productsGrid}>
              <Text style={styles.productsGridTitle}>My Products ({uploadedProducts.length})</Text>
              <View style={styles.productsContainer}>
                {uploadedProducts.map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    <Image source={{ uri: product.image.uri }} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>₱{product.price}</Text>
                    </View>
                    <View style={styles.productActions}>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => editProduct(product)}
                      >
                        <Text style={styles.editButtonText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => deleteProduct(product.id)}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
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
      <StoreO_Footer 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navigation={navigation}
        currentUser={currentUser}
        currentScreen="SO_Profile"
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
              router.push('/store-owner-home');
            })}
            
            {renderBurgerMenuItem('⚙️ Settings', () => {
              setShowBurgerMenu(false);
              Alert.alert('Settings', 'Settings feature coming soon!');
            })}
            
            {renderBurgerMenuItem('👤 Profile Settings', () => {
              setShowBurgerMenu(false);
              router.push('/storeo-profile-settings');
            })}
            
            {renderBurgerMenuItem('🚪 Logout', () => {
              setShowBurgerMenu(false);
              handleLogout();
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Product Upload Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.uploadModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.uploadModalTitle}>Upload Product</Text>
              
              <View style={styles.uploadInputContainer}>
                <Text style={styles.uploadLabel}>Product Name *</Text>
                <TextInput
                  style={styles.uploadInput}
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                />
              </View>

              <View style={styles.uploadInputContainer}>
                <Text style={styles.uploadLabel}>Price *</Text>
                <TextInput
                  style={styles.uploadInput}
                  placeholder="Enter price (₱)"
                  value={newProduct.price}
                  onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.uploadInputContainer}>
                <Text style={styles.uploadLabel}>Product Image *</Text>
                {!newProduct.image ? (
                  <TouchableOpacity 
                    style={styles.imageUploadButton}
                    onPress={handleProductUpload}
                  >
                    <Text style={styles.imageUploadIcon}>📸</Text>
                    <Text style={styles.imageUploadText}>Add Photo</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: newProduct.image.uri }} style={styles.previewImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => setNewProduct({ ...newProduct, image: null })}
                    >
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.uploadModalButtons}>
                <TouchableOpacity 
                  style={styles.uploadCancelButton}
                  onPress={() => {
                    setShowUploadModal(false);
                    setNewProduct({ name: '', price: '', image: null });
                  }}
                >
                  <Text style={styles.uploadCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.uploadSubmitButton}
                  onPress={submitProduct}
                >
                  <Text style={styles.uploadSubmitText}>Upload Product</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.uploadModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.uploadModalTitle}>Edit Product</Text>
              
              <View style={styles.uploadInputContainer}>
                <Text style={styles.uploadLabel}>Product Name *</Text>
                <TextInput
                  style={styles.uploadInput}
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                />
              </View>

              <View style={styles.uploadInputContainer}>
                <Text style={styles.uploadLabel}>Price *</Text>
                <TextInput
                  style={styles.uploadInput}
                  placeholder="Enter price (₱)"
                  value={newProduct.price}
                  onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.uploadInputContainer}>
                <Text style={styles.uploadLabel}>Product Image *</Text>
                {!newProduct.image ? (
                  <TouchableOpacity 
                    style={styles.imageUploadButton}
                    onPress={handleProductUpload}
                  >
                    <Text style={styles.imageUploadIcon}>📸</Text>
                    <Text style={styles.imageUploadText}>Add Photo</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: newProduct.image.uri }} style={styles.previewImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => setNewProduct({ ...newProduct, image: null })}
                    >
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.uploadModalButtons}>
                <TouchableOpacity 
                  style={styles.uploadCancelButton}
                  onPress={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    setNewProduct({ name: '', price: '', image: null });
                  }}
                >
                  <Text style={styles.uploadCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.uploadSubmitButton}
                  onPress={updateProduct}
                >
                  <Text style={styles.uploadSubmitText}>Update Product</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
                  <Text style={styles.commentAuthor}>Customer A</Text>
                  <Text style={styles.commentTime}>1 hour ago</Text>
                </View>
                <Text style={styles.commentText}>Great products! Very fresh and good quality.</Text>
                <TouchableOpacity style={styles.replyButton}>
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>Customer B</Text>
                  <Text style={styles.commentTime}>30 min</Text>
                </View>
                <Text style={styles.commentText}>Thank you for the excellent service!</Text>
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
  storeOwnerName: {
    fontSize: 14,
    color: '#666',
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
  storeName: {
    fontSize: 12,
    color: '#999',
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
  uploadSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  uploadSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  uploadSectionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadModalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  uploadModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  uploadInputContainer: {
    marginBottom: 15,
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  uploadInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  imageUploadButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#FF9800',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: '600',
  },
  imagePreview: {
    position: 'relative',
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: 70,
    backgroundColor: '#FF4444',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  uploadCancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f44336',
    borderRadius: 8,
    marginRight: 10,
  },
  uploadCancelText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadSubmitButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginLeft: 10,
  },
  uploadSubmitText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  productsGrid: {
    marginTop: 20,
  },
  productsGridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#e0e0e0',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  expandToggle: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 15,
  },
  expandArrow: {
    fontSize: 20,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  productActions: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  editButtonText: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
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

export default StoreO_Profile;
