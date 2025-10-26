import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Consumer_Footer from '../../../components/navigation-components/Consumer_Footer';
import { clearCurrentUser, getCurrentUser, UserData } from '../../Database/UserData';
// import C_Header from '../components/C_Header';
// import Footer from '../components/Footer';

// Types and Interfaces
interface ImageData {
  uri: string;
  type: string;
  name: string;
}

interface Post {
  id: number;
  author: string;
  userType: string;
  storeName: string;
  status: 'Selling' | 'Buying';
  title?: string;
  content: string;
  timestamp: string;
  reactions: number;
  comments: number;
  starRating?: number;
  totalReviews?: number;
  images?: string[];
}

interface NewPost {
  content: string;
  status: 'Selling' | 'Buying';
  images: ImageData[];
}

interface ConsumerHomeScreenProps {
  route: {
    params: {
      user: UserData;
    };
  };
  navigation: any; // You can type this more specifically with NavigationProp from @react-navigation/native
}

const Consumer_HomeScreen: React.FC<ConsumerHomeScreenProps> = ({ route, navigation }) => {
  const router = useRouter();
  const { user } = route.params;
  const [currentUser, setCurrentUser] = useState<UserData>(user);
  const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Home');
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<NewPost>({
    content: '',
    status: 'Buying',
    images: []
  });
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [commentImages, setCommentImages] = useState<ImageData[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
      }
    };
    loadCurrentUser();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
      }
    });
    return unsubscribe;
  }, [navigation]);

  // Mock data for Store Owner posts (visible to Consumer)
  const storeOwnerPosts: Post[] = [
    {
      id: 1,
      author: 'Christian Manota',
      userType: 'Store Owner',
      storeName: 'Manota Store',
      status: 'Selling',
      title: 'Fresh Vegetables Available',
      content: 'Fresh vegetables and fruits available! Best prices in town. Visit our store for quality products.',
      timestamp: '30 minutes ago',
      reactions: 22,
      comments: 8,
      starRating: 4.5,
      totalReviews: 42,
      images: ['https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Fresh+Vegetables'],
    },
    {
      id: 2,
      author: 'Maria Garcia',
      userType: 'Store Owner',
      storeName: 'Garcia Market',
      status: 'Selling',
      title: 'Weekend Sale',
      content: '20% off on all vegetables. Fresh from local farmers. Limited time offer!',
      timestamp: '4 hours ago',
      reactions: 35,
      comments: 12,
      starRating: 4.1,
      totalReviews: 35,
    },
    {
      id: 3,
      author: 'John Smith',
      userType: 'Store Owner',
      storeName: 'Smith Grocery',
      status: 'Selling',
      title: 'Imported Fruits Arrived',
      content: 'New shipment of imported fruits! Apples, oranges, and grapes. Premium quality at affordable prices.',
      timestamp: '1 day ago',
      reactions: 28,
      comments: 9,
      starRating: 4.7,
      totalReviews: 58,
    },
  ];

  const openBurgerMenu = () => {
    setShowBurgerMenu(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeBurgerMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 350,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setShowBurgerMenu(false);
    });
  };

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

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <TouchableOpacity 
          style={styles.profilePicture}
          onPress={() => {
            router.push({
              pathname: '/consumer-profile-view',
              params: {
                storeOwner: JSON.stringify({
                  storeName: item.storeName,
                  author: item.author,
                  starRating: item.starRating || 0,
                  totalReviews: item.totalReviews || 0
                }),
                currentUser: JSON.stringify(currentUser)
              }
            });
          }}
        >
          <Text style={styles.profilePictureText}>🏪</Text>
        </TouchableOpacity>
        <View style={styles.authorInfo}>
          <TouchableOpacity 
            onPress={() => {
              router.push({
                pathname: '/consumer-profile-view',
                params: {
                  storeOwner: JSON.stringify({
                    storeName: item.storeName,
                    author: item.author,
                    starRating: item.starRating || 0,
                    totalReviews: item.totalReviews || 0
                  }),
                  currentUser: JSON.stringify(currentUser)
                }
              });
            }}
          >
            <Text style={styles.authorName}>{item.storeName}</Text>
            <Text style={styles.storeName}>{item.author}</Text>
          </TouchableOpacity>
          
          {/* Star Rating for Store Owners */}
          {item.starRating && (
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={[
                    styles.star,
                    star <= Math.floor(item.starRating!) ? styles.filledStar : styles.emptyStar
                  ]}>
                    {star <= Math.floor(item.starRating!) ? '★' : '☆'}
                  </Text>
                ))}
              </View>
              <Text style={styles.ratingText}>{item.starRating} ({item.totalReviews})</Text>
            </View>
          )}
        </View>
        <View style={[styles.statusBadge, 
          { backgroundColor: item.status === 'Buying' ? '#FF9800' : '#4CAF50' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      {/* Post Title */}
      {item.title && (
        <Text style={styles.postTitle}>{item.title}</Text>
      )}
      
      <Text style={styles.postContent}>{item.content}</Text>
      
      {/* Post Images */}
      {item.images && item.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.postImagesContainer}>
          {item.images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.postImage} />
          ))}
        </ScrollView>
      )}
      
      <View style={styles.postFooter}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>👍</Text>
          <Text style={styles.actionCount}>{item.reactions}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            setSelectedPost(item);
            setShowCommentsModal(true);
          }}
        >
          <Text style={styles.actionText}>💭</Text>
          <Text style={styles.actionCount}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            setSelectedPost(item);
            setShowLocationModal(true);
          }}
        >
          <Text style={styles.actionText}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            if (item.userType === 'Store Owner') {
              setSelectedPost(item);
              setShowMessageModal(true);
            } else {
              Alert.alert('Not Available', 'You can only message Store Owners.');
            }
          }}
        >
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

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Gallery', onPress: () => openImageLibrary() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleCamera = () => {
    Alert.alert(
      'Take Photo',
      'Open camera to take a photo',
      [
        { text: 'Open Camera', onPress: () => openCamera() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openImageLibrary = () => {
    const mockImage: ImageData = {
      uri: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Sample+Image',
      type: 'image/jpeg',
      name: 'sample.jpg'
    };
    setNewPost({ ...newPost, images: [...newPost.images, mockImage] });
  };

  const openCamera = () => {
    const mockImage: ImageData = {
      uri: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Camera+Photo',
      type: 'image/jpeg',
      name: 'camera.jpg'
    };
    setNewPost({ ...newPost, images: [...newPost.images, mockImage] });
  };

  const removeImage = (index: number) => {
    const newImages = [...newPost.images];
    newImages.splice(index, 1);
    setNewPost({ ...newPost, images: newImages });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Placeholder until you create C_Header component */}
      <View style={styles.headerPlaceholder}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}></Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AgriHub Davao</Text>
        <TouchableOpacity onPress={() => openBurgerMenu()}>
          <Text style={styles.headerButton}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView ref={scrollViewRef} style={styles.content}>
        <View style={styles.welcomeSection}>
          <TouchableOpacity 
            style={styles.profileSection} 
            onPress={() => router.push('/c-profile')}
          >
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>👤</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.userName || currentUser.firstName}</Text>
              <Text style={styles.roleText}>Consumer Dashboard</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search posts..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.createPostSection}>
          <TouchableOpacity style={styles.createPostButton} onPress={() => setShowCreatePostModal(true)}>
            <Text style={styles.createPostIcon}>📝</Text>
            <Text style={styles.createPostText}>Create New Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Store Owner Posts</Text>
          <FlatList
            data={storeOwnerPosts}
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
        currentUser={currentUser}
        currentScreen="ConsumerHome"
      />

      {/* Burger Menu Modal */}
      <Modal
        visible={showBurgerMenu}
        transparent={true}
        animationType="none"
        onRequestClose={() => closeBurgerMenu()}
      >
        <TouchableOpacity 
          style={styles.burgerModalOverlay} 
          activeOpacity={1} 
          onPress={() => closeBurgerMenu()}
        >
          <Animated.View style={[styles.burgerModalContent, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.burgerMenuHeader}>
              <Text style={styles.burgerMenuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => closeBurgerMenu()}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {renderBurgerMenuItem('🏠 Home', () => {
              closeBurgerMenu();
            })}
            
            {renderBurgerMenuItem('⚙️ Settings', () => {
              closeBurgerMenu();
              Alert.alert('Settings', 'Settings feature coming soon!');
            })}
            
            {renderBurgerMenuItem('👤 Profile Settings', () => {
              closeBurgerMenu();
              navigation.navigate('Consumer_ProfileSettings');
            })}
            
            {renderBurgerMenuItem('🚪 Logout', () => {
              closeBurgerMenu();
              handleLogout();
            })}
            <TouchableOpacity 
              style={styles.burgerCancelButton}
              onPress={() => closeBurgerMenu()}
            >
              <Text style={styles.burgerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePostModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreatePostModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView 
            contentContainerStyle={styles.modalScrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.createPostModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Post</Text>
              <TouchableOpacity onPress={() => setShowCreatePostModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.postForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.formLabel}>Content:</Text>
                <TextInput
                  style={styles.postTextInput}
                  placeholder="What would you like to share?"
                  value={newPost.content}
                  onChangeText={(text) => setNewPost({...newPost, content: text})}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.mediaSection}>
                <Text style={styles.formLabel}>Add Images:</Text>
                <View style={styles.mediaButtons}>
                  <TouchableOpacity 
                    style={styles.mediaButton}
                    onPress={() => handleImagePicker()}
                  >
                    <Text style={styles.mediaButtonText}>📷 Add Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.mediaButton}
                    onPress={() => handleCamera()}
                  >
                    <Text style={styles.mediaButtonText}>📸 Take Photo</Text>
                  </TouchableOpacity>
                </View>
                
                {newPost.images.length > 0 && (
                  <View style={styles.imagePreviewContainer}>
                    <Text style={styles.previewLabel}>Selected Images:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {newPost.images.map((image, index) => (
                        <View key={index} style={styles.imagePreview}>
                          <Image source={{ uri: image.uri }} style={styles.previewImage} />
                          <TouchableOpacity 
                            style={styles.removeImageButton}
                            onPress={() => removeImage(index)}
                          >
                            <Text style={styles.removeImageText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

               <TouchableOpacity 
                 style={styles.submitButton}
                 onPress={() => {
                   if (newPost.content.trim()) {
                     Alert.alert('Success', 'Post created successfully!');
                     setNewPost({content: '', status: 'Buying', images: []});
                     setShowCreatePostModal(false);
                   } else {
                     Alert.alert('Error', 'Please enter post content');
                   }
                 }}
               >
                 <Text style={styles.submitButtonText}>Create Post</Text>
               </TouchableOpacity>
             </View>
             </View>
           </ScrollView>
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setShowCommentsModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* Post Preview */}
            {selectedPost && (
              <View style={styles.postPreview}>
                <View style={styles.postPreviewHeader}>
                  <Text style={styles.postPreviewAuthor}>{selectedPost.storeName || selectedPost.author}</Text>
                  <Text style={styles.postPreviewTime}>{selectedPost.timestamp}</Text>
                </View>
                <Text style={styles.postPreviewContent} numberOfLines={2}>
                  {selectedPost.content}
                </Text>
                <TouchableOpacity style={styles.replyButton}>
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <ScrollView style={styles.commentsContainer}>
              {/* Mock comments */}
              <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>Maria Santos</Text>
                  <Text style={styles.commentTime}>30 min</Text>
                </View>
                <Text style={styles.commentText}>Great quality product! Will definitely order again.</Text>
                {/* Sample comment images */}
                <View style={styles.commentImagesContainer}>
                  <TouchableOpacity onPress={() => setZoomedImage('https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Product+Image')}>
                    <Image 
                      source={{ uri: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Product+Image' }} 
                      style={styles.commentImage} 
                    />
                  </TouchableOpacity>
                </View>
                {/* Reply button */}
                <TouchableOpacity style={styles.replyButton}>
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            <View style={styles.commentInputSection}>
              {/* Image preview for new comment */}
              {commentImages.length > 0 && (
                <View style={styles.commentImagePreviewContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {commentImages.map((img, index) => (
                      <View key={index} style={styles.commentImagePreview}>
                        <Image source={{ uri: img.uri }} style={styles.commentPreviewImage} />
                        <TouchableOpacity 
                          style={styles.removeCommentImageButton}
                          onPress={() => setCommentImages(commentImages.filter((_, i) => i !== index))}
                        >
                          <Text style={styles.removeCommentImageText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
              
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  maxLength={500}
                />
              </View>
              
              <View style={styles.commentActionsRow}>
                <TouchableOpacity 
                  style={styles.commentActionButton}
                  onPress={() => {
                    const mockImage: ImageData = {
                      uri: 'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Comment+Image',
                      type: 'image/jpeg',
                      name: 'comment.jpg'
                    };
                    setCommentImages([...commentImages, mockImage]);
                  }}
                >
                  <Text style={styles.commentActionIcon}>📷</Text>
                  <Text style={styles.commentActionText}>Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.sendCommentButton, (!newComment.trim() && commentImages.length === 0) && styles.sendCommentButtonDisabled]}
                  onPress={() => {
                    if (newComment.trim() || commentImages.length > 0) {
                      Alert.alert('Success', 'Comment posted!');
                      setNewComment('');
                      setCommentImages([]);
                    }
                  }}
                  disabled={!newComment.trim() && commentImages.length === 0}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Zoom Modal */}
      <Modal
        visible={zoomedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setZoomedImage(null)}
      >
        <TouchableOpacity 
          style={styles.zoomModalOverlay}
          activeOpacity={1}
          onPress={() => setZoomedImage(null)}
        >
          <View style={styles.zoomContainer}>
            {zoomedImage && (
              <Image 
                source={{ uri: zoomedImage }} 
                style={styles.zoomedImage}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.locationModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.mapContainer}>
              <Text style={styles.mapPlaceholder}>📍 Store Location</Text>
              <Text style={styles.locationAddress}>123 Main Street, Davao City</Text>
              <Text style={styles.locationCoords}>Coordinates: 7.0731, 125.6128</Text>
              
              <TouchableOpacity style={styles.directionsButton}>
                <Text style={styles.directionsButtonText}>🗺️ Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Message Modal */}
      <Modal
        visible={showMessageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.messageModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Message {selectedPost?.storeName || selectedPost?.author}</Text>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.messagesContainer}>
              {/* Mock conversation */}
              <View style={styles.messageItem}>
                <Text style={styles.messageAuthor}>You</Text>
                <Text style={styles.messageText}>Hi! Are your vegetables still available?</Text>
                <Text style={styles.messageTime}>10:30 AM</Text>
              </View>
              
              <View style={[styles.messageItem, styles.receivedMessage]}>
                <Text style={styles.messageAuthor}>{selectedPost?.storeName || selectedPost?.author}</Text>
                <Text style={styles.messageText}>Yes, we have fresh vegetables available. What would you like to order?</Text>
                <Text style={styles.messageTime}>10:35 AM</Text>
              </View>
            </ScrollView>
            
            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message..."
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <TouchableOpacity 
                style={styles.sendMessageButton}
                onPress={() => {
                  if (newMessage.trim()) {
                    Alert.alert('Success', 'Message sent!');
                    setNewMessage('');
                  }
                }}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
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
  footerPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    padding: 10,
  },
  footerButtonText: {
    fontSize: 24,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  profileIconText: {
    fontSize: 24,
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  roleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  storeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  createPostSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createPostIcon: {
    fontSize: 18,
    marginRight: 8,
    color: 'white',
  },
  createPostText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
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
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profilePictureText: {
    fontSize: 18,
    color: 'white',
  },
  authorInfo: {
    flex: 1,
    marginRight: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
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
  actionCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalScrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  createPostModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  postForm: {
    width: '100%',
  },
  imagePreviewContainer: {
    marginTop: 15,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  imagePreview: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusSelector: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeStatusButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeStatusButtonText: {
    color: 'white',
  },
  inputContainer: {
    marginBottom: 20,
  },
  postTextInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mediaSection: {
    marginBottom: 20,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginHorizontal: 5,
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  burgerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  burgerModalContent: {
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
  burgerCancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  burgerCancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  star: {
    fontSize: 16,
  },
  filledStar: {
    color: '#FFD700',
  },
  emptyStar: {
    color: '#E0E0E0',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  commentsModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  postPreview: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  postPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postPreviewAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  postPreviewTime: {
    fontSize: 12,
    color: '#666',
  },
  postPreviewContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  commentsContainer: {
    maxHeight: 300,
    marginBottom: 15,
  },
  commentItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  commentImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  commentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  replyButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
  replyButtonText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
  commentInputSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  commentImagePreviewContainer: {
    marginBottom: 10,
  },
  commentImagePreview: {
    position: 'relative',
    marginRight: 8,
  },
  commentPreviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeCommentImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeCommentImageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentInputContainer: {
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    backgroundColor: '#F5F5F5',
  },
  commentActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    gap: 6,
  },
  commentActionIcon: {
    fontSize: 18,
  },
  commentActionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sendCommentButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendCommentButtonDisabled: {
    backgroundColor: '#CCC',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  locationModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mapContainer: {
    alignItems: 'center',
  },
  mapPlaceholder: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  locationCoords: {
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  directionsButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  messagesContainer: {
    maxHeight: 300,
    marginBottom: 15,
  },
  messageItem: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  receivedMessage: {
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-start',
  },
  messageAuthor: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    marginBottom: 3,
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 80,
  },
  sendMessageButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  postImagesContainer: {
    marginVertical: 10,
  },
  postImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  zoomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomContainer: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImage: {
    width: '100%',
    height: '100%',
  },
});

export default Consumer_HomeScreen;
