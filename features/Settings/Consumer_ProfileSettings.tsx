import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
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
import { getCurrentUser, updateCurrentUser, UserData } from '../Database/UserData';

interface ConsumerFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  profileImage: string | null;
}

interface ConsumerProfileSettingsProps {
  navigation: any;
  route: any;
}

const Consumer_ProfileSettings: React.FC<ConsumerProfileSettingsProps> = ({ navigation, route }) => {
  const [formData, setFormData] = useState<ConsumerFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    profileImage: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          middleName: userData.middleName || '',
          lastName: userData.lastName || '',
          userName: userData.userName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          profileImage: null,
        });
      } else {
        Alert.alert('Error', 'No user session found. Please login again.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ConsumerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectImageFromGallery = () => {
    setShowImagePicker(true);
  };

  const handleImageSelection = (option: string) => {
    setShowImagePicker(false);
    
    if (option === 'remove') {
      setFormData(prev => ({ ...prev, profileImage: null }));
    } else if (option === 'camera' || option === 'gallery') {
      // Placeholder for image picker - replace with actual image picker implementation
      const placeholderImage = 'https://via.placeholder.com/150/FF9800/FFFFFF?text=👤';
      setFormData(prev => ({ ...prev, profileImage: placeholderImage }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Validate required fields
      const requiredFields: (keyof ConsumerFormData)[] = ['firstName', 'lastName', 'userName', 'email', 'phoneNumber'];
      
      for (let field of requiredFields) {
        if (!formData[field]) {
          Alert.alert('Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return;
        }
      }

      // Update user data
      const updatedUserData: Partial<UserData> = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      };

      console.log('Saving profile changes:', updatedUserData);
      const updatedUser = await updateCurrentUser(updatedUserData);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        console.log('Profile updated successfully:', updatedUser);
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      } else {
        console.error('Failed to update profile');
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading profile...</Text>
              </View>
            ) : (
              <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Profile Settings</Text>
            </View>

            {/* Profile Picture Section */}
            <View style={styles.profileSection}>
              <TouchableOpacity 
                style={styles.profilePicture}
                onPress={selectImageFromGallery}
              >
                {formData.profileImage ? (
                  <Image 
                    source={{ uri: formData.profileImage }} 
                    style={styles.profileImage}
                  />
                ) : (
                  <Text style={styles.profileIcon}>👤</Text>
                )}
                <View style={styles.editIconContainer}>
                  <Text style={styles.editIcon}>📷</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.roleContainer}>
                <Text style={styles.roleText}>Consumer</Text>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name: *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Middle Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your middle name (optional)"
                value={formData.middleName}
                onChangeText={(value) => handleInputChange('middleName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name: *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username: *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a unique username"
                value={formData.userName}
                onChangeText={(value) => handleInputChange('userName', value)}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email: *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number: *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleImageSelection('camera')}
            >
              <Text style={styles.modalOptionIcon}>📷</Text>
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleImageSelection('gallery')}
            >
              <Text style={styles.modalOptionIcon}>🖼️</Text>
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleImageSelection('remove')}
            >
              <Text style={styles.modalOptionIcon}>🗑️</Text>
              <Text style={styles.modalOptionText}>Remove Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF9800',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileIcon: {
    fontSize: 40,
    color: 'white',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  editIcon: {
    fontSize: 14,
  },
  roleContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalCancelButton: {
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});

export default Consumer_ProfileSettings;
