import { USER_ROLES } from '@/constants/user_roles';
import { clearCurrentUser, getCurrentUser, UserData } from '@/features/Database/UserData';
import { db } from '@/firebaseConfig'; // Import your initialized db 
import { useRouter } from 'expo-router';
import { addDoc, collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
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

// Types and Interfaces
interface ImageData {
  uri?: string;
  type?: string;
  name?: string;
}

interface Post {
  id: string;
  author: string;
  userId: string;
  userType: string;
  userRole: 'farmer' | 'supplier' | 'consumer' | 'store_owner';
  title: string;
  content: string;
  createdAt: string;
  reactions?: number;
  comments?: number;
  images?: Array<ImageData>;
  status: 'Selling' | 'Buying';
  starRating?: number;
  totalReviews?: number;
}

interface NewPost {
  id: string;
  author: string;
  userId: string;
  userType: string;
  userRole: 'farmer' | 'supplier' | 'consumer' | 'store_owner';
  createdAt: string;
  title: string;
  content: string;
  status: 'Selling' | 'Buying';
  images?: ImageData[];
  shareLocation?: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface StoreOwnerHomeScreenProps {
  route: {
    params: {
      user: UserData;
    };
  };
  navigation: any;
}

export default function StoreO_HomeScreen({ route, navigation }: StoreOwnerHomeScreenProps) {

  const router = useRouter();
  // router.replace('/store-owner-home');
  const { user } = route.params;
  const [currentUser, setCurrentUser] = useState<UserData>(user);
  const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Home');
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<NewPost>({
    id: '',
    author: currentUser.userName || '',
    userId: currentUser.id ? String(currentUser.id) : '',
    userType: USER_ROLES[currentUser.role as keyof typeof USER_ROLES].name,
    userRole: (["farmer", "supplier", "consumer", "store_owner"].includes(currentUser.role) ? currentUser.role : "store_owner") as "farmer" | "supplier" | "consumer" | "store_owner",
    createdAt: new Date().toISOString(),
    title: '',
    content: '',
    status: 'Selling',
    images: [],
    shareLocation: false
  });
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [commentImages, setCommentImages] = useState<ImageData[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isCreatingPost, setisCreatingPost] = useState<boolean>(false);
  const [createPostText, setCreatePostText] = useState<String>('Create Post');

  const handleCreatePost = async () => {
    try {

      setisCreatingPost(true);
      setCreatePostText('Creating Post...');

      addDoc(collection(db, "posts"), newPost).then((postRef) => {

        const updatePostRef = doc(db, "posts", postRef.id);

        setDoc(updatePostRef, { id: postRef.id }, { merge: true });

      });

    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setisCreatingPost(false);
      setCreatePostText('Create Post');
      Alert.alert('Success', 'Post created successfully!', 
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => setNewPost({...newPost, title: '', content: '', images: []}), // Clear the input here
            },
        ],
        { cancelable: false }
      );
      setShowCreatePostModal(false);
    }
  };
  useEffect(() => {
    const loadPosts = async () => {
      const q = query(collection(db, "posts"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts: Post[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const d = new Date(data.createdAt);
          const options = {
              weekday: 'long' as const,
              year: 'numeric' as const,
              month: 'long' as const,
              day: 'numeric' as const,
              hour: '2-digit' as const,
              minute: '2-digit' as const,
          };
          const time_stamp = d.toLocaleDateString('en-US', options);

          const post: Post = {
            id: data.id,
            author: data.author,
            userId: data.userId,
            userType: data.userType,
            userRole: data.userRole,
            title: data.title,
            content: data.content,
            createdAt: time_stamp,
            reactions: data.reactions,
            comments: data.comments,
            images: data.images,
            status: data.status,
            starRating: data.starRating,
            totalReviews: data.totalReviews,
            // Add other fields if needed
          }
          posts.push({...post});
        });
        setAllPosts(posts);
      });
    };
    loadPosts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
      }
    });
    return unsubscribe;
  });


  // Create a navigation adapter for the footer component
  const footerNavigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'MessagesScreen') {
        router.push('/messages');
      } else if (screen === 'NotificationsScreen') {
        Alert.alert('Coming Soon', 'Notifications feature is under development');
      } else if (screen === 'FriendsScreen') {
        router.push('/friends');
      } else if (screen === 'SO_Profile') {
        router.push('/storeo-profile');
      }
    }
  };

  const getFilteredPosts = () => {
    if (selectedFilter === 'All') {
      return allPosts;
    }
    return allPosts.filter(post => post.userType === selectedFilter);
  };

  let filteredPosts = getFilteredPosts();

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

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setShowFilterModal(false);
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
    setNewPost({ ...newPost, images: [...(newPost.images ?? []), mockImage] });
  };

  const openCamera = () => {
    const mockImage: ImageData = {
      uri: 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Camera+Photo',
      type: 'image/jpeg',
      name: 'camera.jpg'
    };
    setNewPost({ ...newPost, images: [...(newPost.images ?? []), mockImage] });
  };

  const removeImage = (index: number) => {
    const newImages = [...(newPost.images ?? [])];
    newImages.splice(index, 1);
    setNewPost({ ...newPost, images: newImages });
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <TouchableOpacity 
          style={styles.profilePicture}
          onPress={() => {
            const role_item = USER_ROLES[currentUser.role as keyof typeof USER_ROLES].profile_view;
            router.push({
              pathname: role_item as any,
              params: {
                farmerSupplier: JSON.stringify({
                  author: item.author,
                  starRating: item.starRating || 0,
                  totalReviews: item.totalReviews || 0
                }),
                currentUser: JSON.stringify(currentUser)
              }
            });
          }}
        >
          <Text style={styles.profilePictureText}>
            {item.userType === 'Farmer/Supplier' ? '🌾' : '👤'}
          </Text>
        </TouchableOpacity>
        <View style={styles.authorInfo}>
          <TouchableOpacity 
            onPress={() => {
              const role_item = USER_ROLES[currentUser.role as keyof typeof USER_ROLES].profile_view;
              router.push({
                pathname: role_item as any,
                params: {
                  farmerSupplier: JSON.stringify({
                    author: item.author,
                    starRating: item.starRating || 0,
                    totalReviews: item.totalReviews || 0
                  }),
                  currentUser: JSON.stringify(currentUser)
                }
              });
            }}
          >
            <Text style={styles.authorName}>{item.author}</Text>
            <Text style={styles.userType}>{item.userType}</Text>
          </TouchableOpacity>
          
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
      
      {item.title && (
        <Text style={styles.postTitle}>{item.title}</Text>
      )}
      
      <Text style={styles.postContent}>{item.content}</Text>
      
      {item.images && item.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.postImagesContainer}>
          {item.images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri.uri as any }} style={styles.postImage} />
          ))}
        </ScrollView>
      )}
      
      <View style={styles.postFooter}>
        <Text style={styles.timestamp}>{item.createdAt}</Text>
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
        {item.id !== String(currentUser.email) && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            router.push({
              pathname: '/chat',
              params: {
                conversation: JSON.stringify(
                  {
                    id: item.id,
                    name: item.author,
                    userType: USER_ROLES[item.userRole as keyof typeof USER_ROLES].name,
                    lastMessage: '',
                    timestamp: '',
                    unreadCount: 0,
                    avatar: '🏪',
                  }
                )
              }
              });
          }}
        >
          <Text style={styles.actionText}>💬</Text>
        </TouchableOpacity>)}
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
            onPress={() => router.push('/storeo-profile')}
          >
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>🏪</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.storeName || currentUser.userName}</Text>
              <Text style={styles.roleText}>Store Owner Dashboard</Text>
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
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={styles.filterIcon}>🔽</Text>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.createPostSection}>
          <TouchableOpacity style={styles.createPostButton} onPress={() => setShowCreatePostModal(true)}>
            <Text style={styles.createPostIcon}>📝</Text>
            <Text style={styles.createPostText}>Create New Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedFilter === 'All' ? 'All Posts' : `${selectedFilter} Posts`}
            </Text>
            <Text style={styles.postCount}>({filteredPosts.length})</Text>
          </View>
          <FlatList
            data={filteredPosts}
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
        navigation={footerNavigation}
        currentUser={currentUser}
        currentScreen="StoreOwnerHome"
        scrollViewRef={scrollViewRef}
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
              navigation.navigate('StoreO_ProfileSettings');
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

      {/* Filter Modal - Placeholder for now */}
      <Modal visible={showFilterModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <Text style={styles.modalTitle}>Filter Posts</Text>
            <TouchableOpacity onPress={() => handleFilterSelect('All')}>
              <Text style={styles.filterOption}>All Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterSelect('Farmer/Supplier')}>
              <Text style={styles.filterOption}>Farmer/Supplier</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterSelect('Consumer')}>
              <Text style={styles.filterOption}>Consumer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Post Modal */}
      <Modal visible={showCreatePostModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.createPostModal}>
            {/* Header with title and close button */}
            <View style={styles.createPostHeader}>
              <Text style={styles.createPostTitle}>Create New Post</Text>
              <TouchableOpacity 
                style={styles.createPostCloseButton}
                onPress={() => {
                  setShowCreatePostModal(false);
                  setNewPost({...newPost});
                }}
              >
                <Text style={styles.createPostCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Post Type */}
              <View style={styles.postTypeSection}>
                <Text style={styles.createPostLabel}>Post Type</Text>
                <View style={styles.postTypeButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.postTypeButton,
                      newPost.status === 'Selling' && styles.postTypeButtonActive
                    ]}
                    onPress={() => setNewPost({ ...newPost, status: 'Selling' })}
                  >
                    <Text style={[
                      styles.postTypeButtonText,
                      newPost.status === 'Selling' && styles.postTypeButtonTextActive
                    ]}>Selling</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.postTypeButton,
                      newPost.status === 'Buying' && styles.postTypeButtonActive
                    ]}
                    onPress={() => setNewPost({ ...newPost, status: 'Buying' })}
                  >
                    <Text style={[
                      styles.postTypeButtonText,
                      newPost.status === 'Buying' && styles.postTypeButtonTextActive
                    ]}>Buying</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Title */}
              <View style={styles.postContentSection}>
                <Text style={styles.createPostLabel}>Title</Text>
                <TextInput
                  style={styles.postTitleInput}
                  placeholder="Title of your post"
                  placeholderTextColor="#999"
                  numberOfLines={1}
                  value={newPost.title}
                  onChangeText={(text) => setNewPost({ ...newPost, title: text })}
                  textAlignVertical="top"
                />
              </View>

              {/* Content */}
              <View style={styles.postContentSection}>
                <Text style={styles.createPostLabel}>Content</Text>
                <TextInput
                  style={styles.postContentInput}
                  placeholder="What do you want to share?"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={5}
                  value={newPost.content}
                  onChangeText={(text) => setNewPost({ ...newPost, content: text })}
                  textAlignVertical="top"
                />
              </View>

              {/* Add Images */}
              <View style={styles.addImagesSection}>
                <Text style={styles.createPostLabel}>Add Images</Text>
                <View style={styles.imagePickersRow}>
                  <TouchableOpacity 
                    style={styles.imagePickerBox}
                    onPress={handleImagePicker}
                  >
                    <Text style={styles.imagePickerIcon}>🖼️</Text>
                    <Text style={styles.imagePickerCount}>
                      {(newPost.images?.length ?? 0)}/3
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.imagePickerBox}
                    onPress={handleCamera}
                  >
                    <Text style={styles.imagePickerIcon}>📷</Text>
                    <Text style={styles.imagePickerCount}>
                      {(newPost.images?.length ?? 0)}/5
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Display Selected Images */}
                {(newPost.images?.length ?? 0) > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedImagesContainer}>
                    {newPost.images?.map((image, index) => (
                      <View key={index} style={styles.selectedImageWrapper}>
                        <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                        <TouchableOpacity 
                          style={styles.removeSelectedImageButton}
                          onPress={() => removeImage(index)}
                        >
                          <Text style={styles.removeSelectedImageText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Create Post Button */}
              <TouchableOpacity 
                style={styles.createPostSubmitButton}
                onPress={() => {
                  if (!newPost.content.trim()) {
                    Alert.alert('Error', 'Please enter content for your post');
                    return;
                  }

                  handleCreatePost();
      
                }}
                disabled={isCreatingPost}
              >
                <Text style={styles.createPostSubmitText}>{createPostText}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal visible={showCommentsModal} transparent={true} animationType="slide">
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
                  <Text style={styles.postPreviewAuthor}>{selectedPost.author}</Text>
                  <Text style={styles.postPreviewTime}>{selectedPost.createdAt}</Text>
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
              <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>Maria Santos</Text>
                  <Text style={styles.commentTime}>30 min</Text>
                </View>
                <Text style={styles.commentText}>Great quality product! Will definitely order again.</Text>
                <View style={styles.commentImagesContainer}>
                  <TouchableOpacity onPress={() => setZoomedImage('https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Product+Image')}>
                    <Image 
                      source={{ uri: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Product+Image' }} 
                      style={styles.commentImage} 
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.replyButton}>
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            <View style={styles.commentInputSection}>
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

      {/* Location Modal - Placeholder */}
      <Modal visible={showLocationModal} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.locationModal}>
            <Text style={styles.modalTitle}>Location</Text>
            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Message Modal - Placeholder */}
      <Modal visible={showMessageModal} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.messageModal}>
            <Text style={styles.modalTitle}>Message</Text>
            <TextInput style={styles.postContent} placeholder="Type your message..." />
            <View>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.closeButton}>Send</Text>
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginRight: 10,
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
  filterButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  filterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  postCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  postContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
  userType: {
    fontSize: 14,
    color: '#666',
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
  burgerCancelButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 8,
  },
  burgerCancelText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
  },
  filterOption: {
    fontSize: 16,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  createPostModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '85%',
  },
  createPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  createPostTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  createPostCloseButton: {
    padding: 5,
  },
  createPostCloseText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  createPostLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  postTypeSection: {
    marginBottom: 20,
  },
  postTypeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  postTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  postTypeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  postTypeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  postTypeButtonTextActive: {
    color: 'white',
  },
  postContentSection: {
    marginBottom: 20,
  },
  postContentInput: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    color: '#333',
  },
  postTitleInput: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 30,
    color: '#333',
  },
  addImagesSection: {
    marginBottom: 20,
  },
  imagePickersRow: {
    flexDirection: 'row',
    gap: 15,
  },
  imagePickerBox: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  imagePickerCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  selectedImagesContainer: {
    marginTop: 15,
  },
  selectedImageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeSelectedImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeSelectedImageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  createPostSubmitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  createPostSubmitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  locationModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
  },
  messageModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});
