import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';

interface UserConsentProps {
  visible: boolean;
  onAgree: () => void;
  onDecline: () => void;
}

export default function UserConsentAndTerms({ visible, onAgree, onDecline }: UserConsentProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 50; // Increased threshold
    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    
    if (isScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDecline}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🌾</Text>
            </View>
            <Text style={styles.appName}>AgriHub Davao</Text>
          </View>
          <Text style={styles.headerTitle}>User Consent & Terms of Agreement</Text>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.contentContainer}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          <View style={styles.content}>
            {/* Section 1 */}
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.paragraph}>
              Welcome to <Text style={styles.bold}>AgriHubDavao</Text>, a mobile platform connecting Farmers/Suppliers, Store Owners, and Consumers for transparent, secure, and efficient agricultural negotiations.
            </Text>
            <Text style={styles.paragraph}>
              By registering and using AgriHubDavao, you acknowledge and agree to the following terms, including how your data—such as personal details, chat messages, and negotiation history—is collected, used, and protected.
            </Text>

            {/* Section 2 */}
            <Text style={styles.sectionTitle}>2. Data Collection and User Consent</Text>
            <Text style={styles.paragraph}>
              AgriHubDavao collects information during registration and usage to ensure secure, verified, and meaningful interactions between users.
            </Text>
            
            <Text style={styles.subTitle}>Common Fields (All Users)</Text>
            <Text style={styles.bulletPoint}>• First Name, Middle Name, Last Name</Text>
            <Text style={styles.bulletPoint}>• Username</Text>
            <Text style={styles.bulletPoint}>• Email Address</Text>
            <Text style={styles.bulletPoint}>• Phone Number</Text>
            <Text style={styles.bulletPoint}>• Password and Confirm Password</Text>

            <Text style={styles.subTitle}>Farmer/Supplier-Specific Fields</Text>
            <Text style={styles.bulletPoint}>• Farm Location</Text>
            <Text style={styles.bulletPoint}>• PSA/Biodata Document Upload</Text>
            <Text style={styles.bulletPoint}>• Valid Philippine ID Upload</Text>

            <Text style={styles.subTitle}>Store Owner-Specific Fields</Text>
            <Text style={styles.bulletPoint}>• Store Name</Text>
            <Text style={styles.bulletPoint}>• Store Location</Text>
            <Text style={styles.bulletPoint}>• PSA/Biodata Document Upload</Text>
            <Text style={styles.bulletPoint}>• Valid Philippine ID Upload</Text>
            <Text style={styles.bulletPoint}>• Business Permit Upload</Text>

            <Text style={styles.subTitle}>Consumer-Specific Fields</Text>
            <Text style={styles.bulletPoint}>• Only common fields (no document verification required)</Text>

            <Text style={styles.paragraph}>
              By registering, you consent to the collection and processing of your information for:
            </Text>
            <Text style={styles.bulletPoint}>• Account creation and verification</Text>
            <Text style={styles.bulletPoint}>• Role-based access to features</Text>
            <Text style={styles.bulletPoint}>• Geolocation display (for mapping nearby farms and stores)</Text>
            <Text style={styles.bulletPoint}>• Chat and video communication for negotiation</Text>
            <Text style={styles.bulletPoint}>• Chat and negotiation record storage for accountability</Text>

            <Text style={styles.paragraph}>
              All data is securely stored and processed through Firebase Authentication, Firestore Database, and Firebase Storage, following the <Text style={styles.bold}>Philippine Data Privacy Act of 2012 (RA 10173)</Text>.
            </Text>

            {/* Section 3 */}
            <Text style={styles.sectionTitle}>3. Data Privacy, Chat History, and Security</Text>
            
            <Text style={styles.subTitle}>Chat & Call Records:</Text>
            <Text style={styles.paragraph}>
              All chat messages, negotiation histories, and video call logs (metadata only, not recordings) may be stored to ensure transparency, prevent abuse, and support user dispute resolution.
            </Text>
            <Text style={styles.paragraph}>
              These records are not shared publicly and are viewable only by authorized users or administrators for moderation and investigation purposes.
            </Text>

            <Text style={styles.subTitle}>Uploaded Documents (IDs, Permits, PSA):</Text>
            <Text style={styles.paragraph}>
              Encrypted and stored securely in Firebase with limited admin access.
            </Text>

            <Text style={styles.subTitle}>Geolocation Data:</Text>
            <Text style={styles.paragraph}>
              Used solely for displaying farm and store locations on the map and to suggest nearby partners; never sold or shared with third parties.
            </Text>

            <Text style={styles.subTitle}>Data Security:</Text>
            <Text style={styles.bulletPoint}>• Data is encrypted in transit and at rest.</Text>
            <Text style={styles.bulletPoint}>• Users may request data correction, download, or deletion via official support channels.</Text>

            {/* Section 4 */}
            <Text style={styles.sectionTitle}>4. Role-Based User Interaction</Text>
            <Text style={styles.paragraph}>
              To maintain ethical and secure interactions:
            </Text>
            <Text style={styles.bulletPoint}>• Farmers/Suppliers can interact only with Store Owners.</Text>
            <Text style={styles.bulletPoint}>• Store Owners can interact with both Farmers/Suppliers and Consumers.</Text>
            <Text style={styles.bulletPoint}>• Consumers can interact only with Store Owners.</Text>
            <Text style={styles.paragraph}>
              Unauthorized communication between unlinked roles or misuse of stored data is strictly prohibited.
            </Text>

            {/* Section 5 */}
            <Text style={styles.sectionTitle}>5. Code of Conduct</Text>
            <Text style={styles.paragraph}>
              By using AgriHubDavao, you agree to:
            </Text>
            <Text style={styles.bulletPoint}>• Provide truthful and accurate information upon registration.</Text>
            <Text style={styles.bulletPoint}>• Use the platform only for legitimate agricultural purposes.</Text>
            <Text style={styles.bulletPoint}>• Maintain respectful and professional communication in chats and calls.</Text>
            <Text style={styles.bulletPoint}>• Avoid fraud, harassment, or manipulation of negotiation records.</Text>
            <Text style={styles.bulletPoint}>• Refrain from sharing offensive, harmful, or misleading content.</Text>
            <Text style={styles.paragraph}>
              Any violation may lead to temporary suspension or permanent account deletion.
            </Text>

            {/* Section 6 */}
            <Text style={styles.sectionTitle}>6. Chat and Negotiation Data Retention</Text>
            <Text style={styles.paragraph}>
              AgriHubDavao retains chat messages and negotiation histories for recordkeeping and safety purposes.
            </Text>
            <Text style={styles.paragraph}>
              These may be used by administrators to investigate complaints, monitor fair use, or improve service quality.
            </Text>
            <Text style={styles.paragraph}>
              You may request your chat and negotiation history to be deleted, but this will also remove your access to related data (such as transaction notes).
            </Text>
            <Text style={styles.paragraph}>
              AgriHubDavao does not monitor private content in real time, except during formal investigations or when required by law.
            </Text>

            {/* Section 7 */}
            <Text style={styles.sectionTitle}>7. Limitations of Liability</Text>
            <Text style={styles.paragraph}>
              AgriHubDavao:
            </Text>
            <Text style={styles.bulletPoint}>• Does not handle online payments or deliveries.</Text>
            <Text style={styles.bulletPoint}>• Serves purely as a communication and negotiation platform.</Text>
            <Text style={styles.bulletPoint}>• Is not responsible for agreements, disputes, or losses arising from user-to-user transactions or meet-ups.</Text>
            <Text style={styles.paragraph}>
              Users are solely responsible for ensuring fair, honest, and safe dealings.
            </Text>

            {/* Section 8 */}
            <Text style={styles.sectionTitle}>8. User Rights</Text>
            <Text style={styles.paragraph}>
              Under the Philippine Data Privacy Act, you have the right to:
            </Text>
            <Text style={styles.bulletPoint}>• Access, review, and correct your personal information.</Text>
            <Text style={styles.bulletPoint}>• Request deletion of your account and associated data.</Text>
            <Text style={styles.bulletPoint}>• Withdraw consent to data processing (which will deactivate your account).</Text>
            <Text style={styles.bulletPoint}>• Be informed of any major updates in data handling policies.</Text>
            <Text style={styles.paragraph}>
              Requests can be submitted to AgriHubDavao Support.
            </Text>

            {/* Section 9 */}
            <Text style={styles.sectionTitle}>9. Updates to the Terms</Text>
            <Text style={styles.paragraph}>
              AgriHubDavao may update this policy from time to time to reflect new legal requirements or app improvements.
            </Text>
            <Text style={styles.paragraph}>
              You will be notified through the app or via email before any significant changes take effect.
            </Text>

            {/* Section 10 */}
            <Text style={styles.sectionTitle}>10. Agreement</Text>
            <Text style={styles.paragraph}>
              By tapping "I Agree" during registration, you confirm that:
            </Text>
            <Text style={styles.bulletPoint}>• You have read, understood, and accepted this User Consent & Terms of Agreement.</Text>
            <Text style={styles.bulletPoint}>• You allow AgriHubDavao to process your information, including chat and negotiation history, as described.</Text>
            <Text style={styles.bulletPoint}>• You agree to comply with the AgriHubDavao Code of Conduct and Privacy Policy.</Text>
            <Text style={styles.paragraph}>
              If you do not agree, you should not proceed with registration or use of the platform.
            </Text>

            {/* Section 11 */}
            <Text style={styles.sectionTitle}>11. Contact Information</Text>
            <Text style={styles.paragraph}>
              📧 TechMaticAgriHubDavao.support@gmail.com
            </Text>
            <Text style={styles.paragraph}>
              🏢 Davao City, Philippines
            </Text>

            {/* Footer */}
            <Text style={styles.footer}>
              Effective Date: October 2025
            </Text>
            <Text style={styles.footer}>
              © TechMatic — All Rights Reserved
            </Text>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.declineButton} 
            onPress={onDecline}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.agreeButton,
              !hasScrolledToBottom && styles.agreeButtonDisabled
            ]} 
            onPress={onAgree}
            disabled={!hasScrolledToBottom}
          >
            <Text style={styles.agreeButtonText}>I Agree</Text>
          </TouchableOpacity>
        </View>

        {!hasScrolledToBottom && (
          <Text style={styles.scrollHint}>Please scroll to the bottom to continue</Text>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 12,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 10,
    textAlign: 'justify',
  },
  bulletPoint: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 5,
    paddingLeft: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  agreeButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    marginLeft: 10,
    alignItems: 'center',
  },
  agreeButtonDisabled: {
    backgroundColor: '#C8E6C9',
  },
  agreeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollHint: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
  },
});