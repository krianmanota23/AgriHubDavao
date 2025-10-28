import LoginScreen from '@/features/Login&Registration/Login_Screen';

export default LoginScreen;

// import Consumer_HomeScreen from '@/features/Users/Consumer/Consumer_HomeScreen';
// export default Consumer_HomeScreen;

// import { db } from '@/firebaseConfig'; // Import your initialized db
// import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { FlatList, StyleSheet, Text, View } from 'react-native'; // Assuming React Native context for FlatList

// export default function index() {
//   const [data, setData] = useState<{ id: string; [key: string]: any }[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {

//     const fetchData = async () => {  
//         await deleteDoc(doc(db, "agri-stores-01-main", "oHQp2uHG57HAYtjXGoZl"));

//       try {
//         const querySnapshot = await getDocs(collection(db, "agri-stores-01-main"));
//         const items: { id: string; [key: string]: any }[] = [];
//         querySnapshot.forEach((doc) => {
//           items.push({ id: doc.id, ...doc.data() });
//         });
//         setData(items);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching documents: ", error);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []); // Empty dependency array means this runs once on mount

//   if (loading) {
//     return <Text>Loading data...</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={data}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.item}>
//             <Text>{item.name}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 22,
//   },
//   item: {
//     padding: 10,
//     fontSize: 18,
//     height: 44,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     },
// });