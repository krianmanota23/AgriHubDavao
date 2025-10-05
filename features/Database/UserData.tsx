import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  role: string;
  farmLocation?: string;
  storeName?: string;
  storeLocation?: string;
  documents?: {
    psaBiodata?: string;
    validId?: string;
    businessPermit?: string;
  };
}

export const users: UserData[] = [];

export const roles = [
  'Farmer/Supplier',
  'Store Owner', 
  'Consumer'
];

// Data storage functions
export const saveUser = async (userData: UserData) => {
  try {
    console.log('Saving user:', userData.email);
    const existingUsers = await getUsers();
    console.log('Existing users count:', existingUsers.length);
    
    const newUser = {
      ...userData,
      id: Date.now(), // Generate unique ID
    };
    
    const updatedUsers = [...existingUsers, newUser];
    await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    console.log('User saved successfully. Total users now:', updatedUsers.length);
    
    // Verify the save worked
    const verifyUsers = await AsyncStorage.getItem('users');
    console.log('Verification - stored users:', verifyUsers ? JSON.parse(verifyUsers).length : 0);
    
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

export const getUsers = async (): Promise<UserData[]> => {
  try {
    const usersData = await AsyncStorage.getItem('users');
    if (usersData) {
      return JSON.parse(usersData);
    }
    return [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const storedUsers = await getUsers();
    // Combine static users with stored users
    const allUsers = [...users, ...storedUsers];
    return allUsers;
  } catch (error) {
    console.error('Error getting all users:', error);
    return users; // Return static users as fallback
  }
};

export const findUserByEmail = async (email: string): Promise<UserData | null> => {
  try {
    const searchEmail = email.toLowerCase().trim();
    console.log('Looking for user with email:', searchEmail);
    
    // First check static users
    const staticUser = users.find((user: UserData) => user.email.toLowerCase() === searchEmail);
    if (staticUser) {
      console.log('Found user in static users:', staticUser.email);
      return staticUser;
    }
    console.log('Not found in static users');
    
    // Then check stored users
    const storedUsers = await getUsers();
    console.log('Stored users count:', storedUsers.length);
    console.log('Stored user emails:', storedUsers.map((u: UserData) => u.email));
    
    const storedUser = storedUsers.find((user: UserData) => user.email.toLowerCase() === searchEmail);
    if (storedUser) {
      console.log('Found user in stored users:', storedUser.email);
      return storedUser;
    }
    
    console.log('User not found anywhere');
    return null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

// Clear all user data (for development/testing)
export const clearAllUserData = async () => {
  try {
    await AsyncStorage.removeItem('users');
    await AsyncStorage.removeItem('currentUser');
    console.log('All user data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing all user data:', error);
    return false;
  }
};

// Current user session management
export const saveCurrentUser = async (user: UserData): Promise<boolean> => {
  try {
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error saving current user:', error);
    return false;
  }
};

export const getCurrentUser = async (): Promise<UserData | null> => {
  try {
    const currentUserData = await AsyncStorage.getItem('currentUser');
    if (currentUserData) {
      return JSON.parse(currentUserData);
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const clearCurrentUser = async () => {
  try {
    await AsyncStorage.removeItem('currentUser');
    return true;
  } catch (error) {
    console.error('Error clearing current user:', error);
    return false;
  }
};

export const updateCurrentUser = async (updatedUserData: Partial<UserData>): Promise<UserData | null> => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const mergedUserData = { ...currentUser, ...updatedUserData };
      await AsyncStorage.setItem('currentUser', JSON.stringify(mergedUserData));
      
      // Also update in stored users if it exists there
      const storedUsers = await getUsers();
      const userIndex = storedUsers.findIndex((user: UserData) => user.id === currentUser.id);
      if (userIndex !== -1) {
        storedUsers[userIndex] = mergedUserData;
        await AsyncStorage.setItem('users', JSON.stringify(storedUsers));
      }
      
      return mergedUserData;
    }
    return null;
  } catch (error) {
    console.error('Error updating current user:', error);
    return null;
  }
};