import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearCurrentUser } from '../../Database/UserData';

interface StoreOwner {
  storeName: string;
  author: string;
  starRating: number;
  totalReviews: number;
}

interface Post {
  id: number;
  content: string;
  status: 'Selling' | 'Buying';
  timestamp: string;
  date: string;
  reactions: number;
  comments: number;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image: { uri: string };
}

const StoreOwnerProfileView: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse store owner data from params
  const storeOwner: StoreOwner = params.storeOwner 
    ? JSON.parse(params.storeOwner as string)
    : { storeName: 'Unknown Store', author: 'Unknown', starRating: 0, totalReviews: 0 };
  
  const currentUser: any = params.currentUser
    ? JSON.parse(params.currentUser as string)
    : null;
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Mock posts data
  const allStoreOwnerPosts: Post[] = [
    {
      id: 1,
      content: 'Fresh vegetables available daily! Best quality produce from local farms. Contact us for bulk orders.',
      status: 'Selling',
      timestamp: '2 hours ago',
      date: '2024-01-15',
      reactions: 12,
      comments: 5,
    },
    {
      id: 2,
      content: 'Special discount on organic tomatoes this week! 20% off for regular customers.',
      status: 'Selling',
      timestamp: '1 day ago',
      date: '2024-01-14',
      reactions: 18,
      comments: 8,
    },
    {
      id: 3,
      content: 'Looking for reliable suppliers of root vegetables. Long-term partnership preferred.',
      status: 'Buying',
      timestamp: '3 days ago',
      date: '2024-01-12',
      reactions: 7,
      comments: 3,
    },
    {
      id: 4,
      content: 'Thank you to all our customers for your continued support! New shipment arriving tomorrow.',
      status: 'Selling',
      timestamp: '1 week ago',
      date: '2024-01-08',
      reactions: 25,
      comments: 12,
    },
  ];

  const storeOwnerPosts = allStoreOwnerPosts.filter(post => post.status === 'Selling');

  // Mock products showcase data for the store owner
  const storeProducts: Product[] = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: '120',
      image: { uri: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=🍅' },
    },
    {
      id: 2,
      name: 'Organic Carrots',
      price: '80',
      image: { uri: 'https://via.placeholder.com/150x150/FF8C42/FFFFFF?text=🥕' },
    },
    {
      id: 3,
      name: 'Green Lettuce',
      price: '60',
      image: { uri: 'https://via.placeholder.com/150x150/6BCF7F/FFFFFF?text=🥬' },
    },
    {
      id: 4,
      name: 'Red Onions',
      price: '100',
      image: { uri: 'https://via.placeholder.com/150x150/8E44AD/FFFFFF?text=🧅' },
    },
    {
      id: 5,
      name: 'Fresh Potatoes',
      price: '70',
      image: { uri: 'https://via.placeholder.com/150x150/D4AC0D/FFFFFF?text=🥔' },
    },
    {
      id: 6,
      name: 'Bell Peppers',
      price: '150',
      image: { uri: 'https://via.placeholder.com/150x150/E74C3C/FFFFFF?text=🫑' },
    },
  ];

  const submitRating = () => {
    if (userRating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    Alert.alert('Success', `You rated ${storeOwner.storeName} ${userRating} stars!`);
    setShowRatingModal(false);
    setUserRating(0);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.postInfo}>
          <View style={[styles.statusBadge, 
            { backgroundColor: item.status === 'Buying' ? '#FF9800' : '#4CAF50' }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.postDate}>{item.date}</Text>
        </View>
      </View>
      
      <Text style={styles.postContent}>{item.content}</Text>
      
      <View style={styles.postFooter}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>👍 {item.reactions}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            setSelectedPost(item);
            setShowCommentsModal(true);
          }}
        >
          <Text style={styles.actionText}>💭 {item.comments}</Text>
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

  const renderStarRating = (rating: number, onPress: ((star: number) => void) | null = null, size: number = 20) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onPress && onPress(star)}
          disabled={!onPress}
        >
          <Text style={[
            styles.star,
            { fontSize: size },
            star <= rating ? styles.filledStar : styles.emptyStar
          ]}>
            {star <= rating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Store Profile</Text>
        <TouchableOpacity 
          style={styles.burgerButton}
          onPress={() => setShowBurgerMenu(true)}
        >
          <Text style={styles.burgerButtonText}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>🏪</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.storeName}>{storeOwner.storeName}</Text>
              <Text style={styles.ownerName}>{storeOwner.author}</Text>
              
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={[
                      styles.star,
                      star <= Math.floor(storeOwner.starRating) ? styles.filledStar : styles.emptyStar
                    ]}>
                      {star <= Math.floor(storeOwner.starRating) ? '★' : '☆'}
                    </Text>
                  ))}
                </View>
                <Text style={styles.ratingText}>{storeOwner.starRating} ({storeOwner.totalReviews})</Text>
              </View>

              <TouchableOpacity 
                style={styles.rateButton}
                onPress={() => setShowRatingModal(true)}
              >
                <Text style={styles.rateButtonText}>Rate Store</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Products Showcase ({storeProducts.length})</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsScrollContainer}
            >
              {storeProducts.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  <Image source={product.image} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>₱{product.price}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.postsSection}>
            <Text style={styles.sectionTitle}>Recent Posts ({storeOwnerPosts.length})</Text>
            <FlatList
              data={storeOwnerPosts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showRatingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate {storeOwner.storeName}</Text>
            <Text style={styles.modalSubtitle}>How would you rate this store?</Text>
            
            <View style={styles.ratingModalSection}>
              {renderStarRating(userRating, setUserRating, 30)}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowRatingModal(false);
                  setUserRating(0);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={submitRating}
              >
                <Text style={styles.submitButtonText}>Submit Rating</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showBurgerMenu}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowBurgerMenu(false)}
      >
        <TouchableOpacity 
          style={styles.burgerModalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowBurgerMenu(false)}
        >
          <View style={styles.burgerModalContent}>
            <Text style={styles.burgerModalTitle}>Menu</Text>
            
            <TouchableOpacity 
              style={styles.burgerMenuItem}
              onPress={() => {
                setShowBurgerMenu(false);
                // Navigate based on current user's role
                if (currentUser?.role === 'Consumer') {
                  router.push('/consumer-home');
                } else if (currentUser?.role === 'Farmer/Supplier') {
                  router.push('/supplier-home');
                } else {
                  router.back();
                }
              }}
            >
              <Text style={styles.burgerMenuText}>🏠 Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.burgerMenuItem}
              onPress={() => {
                setShowBurgerMenu(false);
                // Navigate based on current user's role
                if (currentUser?.role === 'Consumer') {
                  router.push('/c-profile');
                } else if (currentUser?.role === 'Farmer/Supplier') {
                  router.push('/fs-profile');
                } else {
                  router.back();
                }
              }}
            >
              <Text style={styles.burgerMenuText}>👤 Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.burgerMenuItem}
              onPress={() => {
                setShowBurgerMenu(false);
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
              }}
            >
              <Text style={styles.burgerMenuText}>🚪 Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.burgerCancelButton}
              onPress={() => setShowBurgerMenu(false)}
            >
              <Text style={styles.burgerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
                  <Text style={styles.commentAuthor}>Francis Manibad</Text>
                  <Text style={styles.commentTime}>2 hours ago</Text>
                </View>
                <Text style={styles.commentText}>Fresh organic tomatoes available! 50kg ready for harvest. Best quality, competitive price. ...</Text>
                <TouchableOpacity style={styles.replyButton}>
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>Maria Santos</Text>
                  <Text style={styles.commentTime}>30 min</Text>
                </View>
                <Text style={styles.commentText}>Great quality product! Will definitely order again.</Text>
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50, backgroundColor: '#4CAF50' },
  backButton: { padding: 5 },
  backButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  burgerButton: { padding: 5 },
  burgerButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1 },
  profileSection: { backgroundColor: 'white', margin: 20, borderRadius: 15, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  profileIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  profileIconText: { fontSize: 24 },
  profileInfo: { flex: 1 },
  storeName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  ownerName: { fontSize: 16, color: '#666', marginBottom: 10 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  starsContainer: { flexDirection: 'row', marginRight: 8 },
  star: { marginRight: 2 },
  filledStar: { color: '#FFD700' },
  emptyStar: { color: '#DDD' },
  ratingText: { fontSize: 14, color: '#666' },
  rateButton: { backgroundColor: '#2196F3', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, alignItems: 'center' },
  rateButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  postsSection: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  postContainer: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  postInfo: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 10 },
  statusText: { color: 'white', fontSize: 12, fontWeight: '600' },
  postDate: { fontSize: 12, color: '#666' },
  postContent: { fontSize: 16, color: '#333', lineHeight: 22, marginBottom: 10 },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timestamp: { fontSize: 12, color: '#999' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 15, padding: 25, width: '85%', maxWidth: 350 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#333' },
  modalSubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#666' },
  ratingModalSection: { alignItems: 'center', marginBottom: 25 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { flex: 1, paddingVertical: 12, backgroundColor: '#f44336', borderRadius: 8, marginRight: 10 },
  cancelButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  submitButton: { flex: 1, paddingVertical: 12, backgroundColor: '#4CAF50', borderRadius: 8, marginLeft: 10 },
  submitButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  postActions: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 10 },
  actionButton: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  actionText: { fontSize: 14, color: '#666' },
  burgerModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  burgerModalContent: { backgroundColor: 'white', borderRadius: 15, padding: 20, width: '80%', maxWidth: 300 },
  burgerModalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
  burgerMenuItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  burgerMenuText: { fontSize: 16, color: '#333' },
  burgerCancelButton: { marginTop: 15, paddingVertical: 12, backgroundColor: '#f44336', borderRadius: 8 },
  burgerCancelText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  productsSection: { paddingHorizontal: 20, paddingBottom: 20 },
  productsScrollContainer: { paddingRight: 20 },
  productCard: { width: 150, backgroundColor: '#f8f9fa', borderRadius: 10, marginRight: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  productImage: { width: '100%', height: 100, backgroundColor: '#e0e0e0' },
  productInfo: { padding: 10 },
  productName: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
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

export default StoreOwnerProfileView;
