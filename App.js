import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './supabase';

// --- SCREEN IMPORTS ---
// Ensure these paths match your actual folder structure exactly
import LoginScreen         from './screens/LoginScreen';
import HomeScreen          from './screens/Home';
import BrowseScreen        from './screens/Browse';
import OrdersScreen        from './screens/Orders';
import MessagesScreen      from './screens/Messages';
import ProfileScreen       from './screens/Profile';
import GownDetailScreen    from './screens/GownDetail';
import BookNowScreen       from './screens/BookNow';
import ChatScreen          from './screens/Chat';
import ReviewsScreen       from './screens/Reviews';
import TrackOrderScreen    from './screens/TrackOrderScreen';
import NotificationsScreen from './screens/Notifications'; 

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- BRAND CONSTANTS ---
const BRAND_GOLD = '#C5A373';
const BRAND_DARK = '#1A1110';
const BRAND_BG   = '#F9F5F1';

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Browse') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Orders') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Messages') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: BRAND_GOLD,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { 
          height: 70, 
          paddingBottom: 12, 
          paddingTop: 8, 
          backgroundColor: BRAND_DARK, 
          borderTopWidth: 0 
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="Browse"   component={BrowseScreen} />
      <Tab.Screen name="Orders"   component={OrdersScreen}   options={{ title: 'MY ORDERS' }} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <Ionicons name="shirt" size={60} color={BRAND_DARK} />
        <ActivityIndicator size="small" color={BRAND_GOLD} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator 
        screenOptions={{ 
          headerStyle: { backgroundColor: BRAND_DARK, elevation: 0, shadowOpacity: 0 }, 
          headerTintColor: BRAND_GOLD, 
          headerTitleStyle: { fontWeight: '700', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }, 
          headerBackTitleVisible: false 
        }}
      >
        {!session ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
        ) : (
          <>
            {/* Main Tabs is the base for logged-in users */}
            <Stack.Screen 
              name="Main" 
              component={MainTabs} 
              options={{ headerShown: false }} 
            />
            
            {/* Notifications is a sibling to Main so it can show over the tabs */}
            <Stack.Screen 
              name="Notifications" 
              component={NotificationsScreen} 
              options={{ headerShown: false }} 
            />
            
            {/* Other Detail Screens */}
            <Stack.Screen name="GownDetail" component={GownDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BookNow" component={BookNowScreen} options={{ title: 'Reservation' }} />
            <Stack.Screen name="TrackOrder" component={TrackOrderScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Concierge' }} />
            <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ title: 'Client Reviews' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F9F5F1' 
  }
});