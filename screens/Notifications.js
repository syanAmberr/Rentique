import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  StatusBar, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase';

const BRAND_GOLD = '#C5A373';
const BRAND_DARK = '#1A1110';
const BRAND_BG   = '#F9F5F1';
const BRAND_LIGHT_GOLD = '#FDF9F4';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- PRETEND NOTIFICATIONS ---
  const PRETEND_NOTIFS = [
    {
      id: 'mock-1',
      title: 'Welcome to Rentique ✨',
      message: 'Your journey to elegance starts here. Enjoy 10% off your first reservation with code RENTIQUE10.',
      created_at: new Date().toISOString(),
      is_read: false,
      type: 'system'
    },
    {
      id: 'mock-2',
      title: 'Style Tip: Summer Galas 🥂',
      message: 'Our new Emerald Wrap Gowns are trending this week. Pair them with silver accessories for a timeless look.',
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      is_read: true,
      type: 'tip'
    }
  ];

  const fetchNotifications = async () => {
    try {
      setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Merge real Supabase data with the Pretend notifications
      setNotifications([...data, ...PRETEND_NOTIFS]);
    } catch (error) {
      console.error('Error:', error.message);
      // If error (or no internet), just show pretend ones
      setNotifications(PRETEND_NOTIFS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const markAsRead = (id) => {
    // Only update Supabase if it's not a mock ID
    if (!id.toString().startsWith('mock')) {
       supabase.from('notifications').update({ is_read: true }).eq('id', id);
    }
    
    // Update local UI immediately
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[s.card, !item.is_read && s.unreadCard]} 
      onPress={() => markAsRead(item.id)}
    >
      <View style={[s.iconBox, { backgroundColor: item.is_read ? '#f4f4f4' : BRAND_LIGHT_GOLD }]}>
        <Ionicons 
          name={item.type === 'tip' ? "sparkles" : "notifications"} 
          size={18} 
          color={item.is_read ? "#aaa" : BRAND_GOLD} 
        />
      </View>
      
      <View style={s.textCont}>
        <View style={s.row}>
          <Text style={[s.title, !item.is_read && s.unreadText]}>{item.title}</Text>
          {!item.is_read && <View style={s.dot} />}
        </View>
        <Text style={s.msg} numberOfLines={2}>{item.message}</Text>
        <Text style={s.time}>{new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <View style={s.centered}><ActivityIndicator color={BRAND_GOLD} /></View>;

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={BRAND_DARK} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>NOTIFICATIONS</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} tintColor={BRAND_GOLD} />
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND_BG },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 3, color: BRAND_DARK, textAlign: 'center' },
  list: { paddingVertical: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    borderColor: BRAND_GOLD,
    backgroundColor: '#fff',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  textCont: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '600', color: '#333' },
  unreadText: { color: BRAND_DARK, fontWeight: '700' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: BRAND_GOLD },
  msg: { fontSize: 12, color: '#666', marginTop: 4, lineHeight: 18 },
  time: { fontSize: 10, color: '#bbb', marginTop: 8, fontWeight: '500' },
});