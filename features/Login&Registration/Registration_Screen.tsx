import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import UserConsentAndTerms from './UserConsent&TermsOfAgreement';
import { saveUser, saveCurrentUser, UserData } from '../Database/UserData';

type UserRole = 'Farmer/Supplier' | 'StoreOwner' | 'Consumer' | null;

interface DocumentImages {
  psaBiodata: string | null;
  validId: string | null;
  businessPermit?: string | null;
}

export default function RegistrationScreen() {
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  // Common fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Role-specific fields
  const [farmLocation, setFarmLocation] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeLocation, setStoreLocation] = useState('');

  // Document images
  const [documents, setDocuments] = useState<DocumentImages>({
    psaBiodata: null,
    validId: null,
    businessPermit: null,
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleModal(false);
  };

  const pickImage = async (documentType: keyof DocumentImages) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDocuments({ ...documents, [documentType]: result.assets[0].uri });
    }
  };

  const handleRegister = () => {
    // Validation
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // Basic validation for required fields
    if (!firstName || !lastName || !userName || !email || !phoneNumber || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Role-specific validation (documents are now optional for testing)
    if (selectedRole === 'Farmer/Supplier') {
      if (!farmLocation) {
        Alert.alert('Error', 'Please enter your farm location');
        return;
      }
    }

    if (selectedRole === 'StoreOwner') {
      if (!storeName || !storeLocation) {
        Alert.alert('Error', 'Please enter store name and location');
        return;
      }
    }

    // Show consent modal
    setShowConsentModal(true);
  };

  const handleAgreeToTerms = async () => {
    setShowConsentModal(false);
    
    try {
      // Prepare user data based on role
      const userData: UserData = {
        email,
        password,
        firstName,
        middleName,
        lastName,
        userName,
        phoneNumber,
        role: selectedRole === 'StoreOwner' ? 'Store Owner' : selectedRole || 'Consumer',
      };

      // Add role-specific fields
      if (selectedRole === 'Farmer/Supplier') {
        userData.farmLocation = farmLocation;
        userData.documents = {
          psaBiodata: documents.psaBiodata || undefined,
          validId: documents.validId || undefined,
        };
      } else if (selectedRole === 'StoreOwner') {
        userData.storeName = storeName;
        userData.storeLocation = storeLocation;
        userData.documents = {
          psaBiodata: documents.psaBiodata || undefined,
          validId: documents.validId || undefined,
          businessPermit: documents.businessPermit || undefined,
        };
      }

      // Save user to storage
      const saved = await saveUser(userData);
      
      if (saved) {
        // Set as current user
        await saveCurrentUser(userData);
        
        // Show success message and navigate
        Alert.alert('Success', 'Registration completed successfully! Welcome to AgriHub Davao.', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to login screen
              // User can now login with their credentials
              router.replace('/');
            }
          }
        ]);
      } else {
        Alert.alert('Error', 'Failed to save user data. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An error occurred during registration. Please try again.');
    }
  };

  const handleDeclineTerms = () => {
    setShowConsentModal(false);
    Alert.alert('Registration Cancelled', 'You must agree to the terms to register.');
  };

  const renderRoleModal = () => (
    <Modal
      visible={showRoleModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowRoleModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Your Role</Text>

          <TouchableOpacity
            style={styles.roleOption}
            onPress={() => handleRoleSelect('Farmer/Supplier')}
          >
            <Text style={styles.roleOptionText}>🌾 Farmer/Supplier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleOption}
            onPress={() => handleRoleSelect('StoreOwner')}
          >
            <Text style={styles.roleOptionText}>🏪 Store Owner</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleOption}
            onPress={() => handleRoleSelect('Consumer')}
          >
            <Text style={styles.roleOptionText}>🛒 Consumer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowRoleModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.centeredLogoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🌾</Text>
            </View>
            <Text style={styles.appName}>AgriHub Davao</Text>
          </View>
        </View>
        <Text style={styles.title}>Registration</Text>
      </View>

      {/* Role Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Role *</Text>
        <TouchableOpacity
          style={styles.roleSelector}
          onPress={() => setShowRoleModal(true)}
        >
          <Text style={selectedRole ? styles.roleSelectorText : styles.roleSelectorPlaceholder}>
            {selectedRole || 'Choose your role'}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      {selectedRole && (
        <>
          {/* Common Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Middle Name</Text>
            <TextInput
              style={styles.input}
              value={middleName}
              onChangeText={setMiddleName}
              placeholder="Enter middle name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>User Name *</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Enter username"
              autoCapitalize="none"
            />
          </View>

          {/* Role-Specific Fields */}
          {selectedRole === 'Farmer/Supplier' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Farm Location *</Text>
              <TextInput
                style={styles.input}
                value={farmLocation}
                onChangeText={setFarmLocation}
                placeholder="Enter farm location"
              />
            </View>
          )}

          {selectedRole === 'StoreOwner' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Store Name *</Text>
                <TextInput
                  style={styles.input}
                  value={storeName}
                  onChangeText={setStoreName}
                  placeholder="Enter store name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Store Location *</Text>
                <TextInput
                  style={styles.input}
                  value={storeLocation}
                  onChangeText={setStoreLocation}
                  placeholder="Enter store location"
                />
              </View>
            </>
          )}

          {/* Common Fields Continued */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry
            />
          </View>

          {/* Document Verification Section (Optional for Testing) */}
          {selectedRole !== 'Consumer' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Document Verification (Optional)</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>PSA/Biodata Document (Optional)</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => pickImage('psaBiodata')}
                >
                  <Text style={styles.uploadButtonText}>
                    {documents.psaBiodata ? '✓ Document Uploaded' : '📄 Upload Document'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Valid Philippine ID (Optional)</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => pickImage('validId')}
                >
                  <Text style={styles.uploadButtonText}>
                    {documents.validId ? '✓ ID Uploaded' : '🪪 Upload Valid ID'}
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedRole === 'StoreOwner' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Business Permit (Optional)</Text>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => pickImage('businessPermit')}
                  >
                    <Text style={styles.uploadButtonText}>
                      {documents.businessPermit ? '✓ Permit Uploaded' : '📋 Upload Business Permit'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>login here</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {renderRoleModal()}
      
      <UserConsentAndTerms
        visible={showConsentModal}
        onAgree={handleAgreeToTerms}
        onDecline={handleDeclineTerms}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  topBar: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  centeredLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 24,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  roleSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleSelectorText: {
    fontSize: 16,
    color: '#333',
  },
  roleSelectorPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleOption: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  roleOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 10,
    padding: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});