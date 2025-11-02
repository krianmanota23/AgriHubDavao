import { getCurrentUser, UserData } from '@/features/Database/UserData';
import { db } from '@/firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface Conversation {
  id: number;
  name: string;
  userType: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
}

const combineIds = (params: [string, string]) => {
  const sortedIds = params.sort();
  console.log('sortedIds', sortedIds);
  console.log('combinedId', sortedIds.join('_'));
  
  return sortedIds.join('_');
}

export default function ChatScreen({ route, navigation }: { route: any; navigation: any; }) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [convoId, setConvoId] = useState<string>('');

  console.log('useLocalSearchParams params', params);
  

  // Parse conversation from params
  const conversation: Conversation = params.conversation 
    ? JSON.parse(params.conversation as string) 
    : {
        id: 0,
        name: 'Unknown',
        userType: 'Unknown',
        lastMessage: '',
        timestamp: '',
        unreadCount: 0,
        avatar: '👤',
      };

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
      } else {
        router.replace('/login');
      }
    };
    loadUser();
  }, []);


  useEffect(() => {

    const nav_params: [string, string] = [String(params.itemUserId), String(params.currentUserId)];
    const convoId_ = combineIds(nav_params);
    setConvoId(convoId_);

    const loadMessages = async () => {
    const q = query(collection(db, "messages"), where("convoId", "==", convoId_), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages([]); // Clear previous messages
      const messages_: Message[] = [];
        querySnapshot.forEach((dc) => {
          const messageData = dc.data();
          // doc.data() is never undefined for query doc snapshots
          console.log('doc fields', messageData.message);
          const message_: Message = {
            id: messageData.id,
            text: messageData.message,
            sender: messageData.sent_by,
            timestamp: new Date(messageData.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCurrentUser: messageData.sent_by === params.currentUserId,
          };
          messages_.push(message_);
        });
        setMessages(messages_);
      });
    };
    loadMessages();
  }, []);

  const getHeaderColor = () => {
    if (!currentUser) return '#4CAF50';
    
    switch (currentUser.role) {
      case 'Store Owner':
        return '#2196F3';
      case 'Consumer':
        return '#FF9800';
      default: // Farmer/Supplier
        return '#4CAF50';
    }
  };

  const handleVideoCall = () => {
    Alert.alert(
      'Video Call',
      `Start a video call with ${conversation.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => Alert.alert('Coming Soon', 'Video call feature is under development')
        },
      ]
    );
  };

  const handleImageUpload = () => {
    Alert.alert('Coming Soon', 'Image upload feature is under development');
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: currentUser?.firstName || 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    };
    
    // Add a new document with a generated id.
    addDoc(collection(db, "messages"), {
      id:'',
      message: newMessage,
      convoId: convoId,
      sent_by: currentUser?.email,
      timestamp: new Date(),
    }).then(async (newMessageDocRef) => {


      const docConvo = doc(db, "convo", convoId);
      const docConvoSnap = await getDoc(docConvo);

      if (docConvoSnap.exists()) {
        console.log("Document data:", docConvoSnap.data());
        updateDoc(doc(db, "convo", convoId), {
          last_message: { text: newMessage, sent_by: currentUser?.email },
          updated_at: new Date(),
        });
      } else {
        const docRef = await setDoc(doc(db, "convo", convoId), {
          last_message: { text: newMessage, sent_by: currentUser?.email },
          created_at: new Date(),
          updated_at: new Date(),
          users: [currentUser?.email, params.itemUserId],
        });
      }

      if(newMessageDocRef.id){
        updateDoc(doc(db, "messages", newMessageDocRef.id), {
          id: newMessageDocRef.id,
          convoId: convoId,
        });
      }

      setNewMessage('');
    }).catch((error) => {
      console.error("Error adding message: ", error);
    })
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isCurrentUser ? { ...styles.currentUserBubble, backgroundColor: getHeaderColor() } : styles.otherUserBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.isCurrentUser ? styles.currentUserTime : styles.otherUserTime
        ]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust offset as needed
    >
      <StatusBar barStyle="light-content" backgroundColor={getHeaderColor()} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: getHeaderColor() }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{conversation.name}</Text>
          <Text style={styles.headerType}>{conversation.userType}</Text>
        </View>
        <TouchableOpacity onPress={handleVideoCall} style={styles.videoCallButton}>
          <Text style={styles.videoCallIcon}>📹</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        inverted={true}
      />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity 
            style={styles.imageButton}
            onPress={handleImageUpload}
          >
            <Text style={styles.imageIcon}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: getHeaderColor() }]}
            onPress={sendMessage}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50,
  },
  backButton: {
    fontSize: 24,
    color: 'white',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerType: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  placeholder: {
    width: 24,
  },
  videoCallButton: {
    padding: 5,
  },
  videoCallIcon: {
    fontSize: 24,
    color: 'white',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 15,
  },
  currentUserMessage: {
    alignItems: 'flex-end',
  },
  otherUserMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  currentUserBubble: {
    borderBottomRightRadius: 5,
  },
  otherUserBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherUserTime: {
    color: '#999',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  imageButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    fontSize: 20,
  },
  sendButton: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});