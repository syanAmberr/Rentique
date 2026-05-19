
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../supabase';


const BRAND_GOLD = '#C5A373';
const BRAND_DARK = '#1A1110';
const BRAND_BG   = '#F9F5F1';

export default function MessagesScreen({ navigation }) {
  const [orders,     setOrders     ] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading,    setLoading    ] = useState(true);

  useFocusEffect(
    useCallback(() => { 
      load(); 
    }, [])
  );

  const load = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select('id, gown_name, booking_date, return_date, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error loading messages:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => { 
    setRefreshing(true); 
    await load(); 
    setRefreshing(false); 
  };

  const fmtDate = (str) => { 
    if (!str) return '';
    try { 
      const d = new Date(str);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return `${months[d.getMonth()]} ${d.getDate()}`;
    } catch { return ''; } 
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#4CAF50';
      case 'cancelled': return '#D32F2F';
      case 'completed': return '#1565C0';
      default: return BRAND_GOLD;
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[s.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={BRAND_GOLD} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={s.header}>
        <Text style={s.headerTitle}>MESSAGES</Text>
        <Text style={s.headerSub}>Speak with our stylists and concierge team</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={s.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND_GOLD} />
        }
        ListHeaderComponent={
          <>
            {/* General Atelier Support Chat */}
            <TouchableOpacity 
              style={s.shopCard} 
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Chat', {})}
            >
              <View style={s.shopIcon}>
                <Ionicons name="sparkles" size={22} color={BRAND_GOLD} />
              </View>
              <View style={s.shopInfo}>
                <Text style={s.shopName}>RENTIQUE ATELIER</Text>
                <Text style={s.shopSub}>General inquiries and style advice</Text>
              </View>
              <View style={s.onlineDot} />
              <Ionicons name="chevron-forward" size={16} color={BRAND_GOLD} />
            </TouchableOpacity>

            <Text style={s.sectionLabel}>RESERVATION DIALOGUES</Text>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={s.card} 
            onPress={() => navigation.navigate('Chat', { booking: item })}
          >
            <View style={s.cardIcon}>
              <Ionicons name="bookmark-outline" size={18} color={BRAND_DARK} />
            </View>
            <View style={s.cardInfo}>
              <Text style={s.cardTitle} numberOfLines={1}>
                {item.gown_name?.toUpperCase() || 'VALUED CLIENT'}
              </Text>
              <Text style={s.cardSub}>
                ID: #{(item.id || '').slice(-6).toUpperCase()}
              </Text>
              
              <View style={s.statusRow}>
                <View style={[s.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                <Text style={s.statusText}>
                  {(item.status || 'pending').toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={s.cardRight}>
              <Text style={s.cardDate}>{fmtDate(item.created_at)}</Text>
              <Ionicons name="chevron-forward" size={14} color="#ddd" style={{ marginTop: 12 }} />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color="#eee" />
            <Text style={s.emptyTitle}>NO ACTIVE DIALOGUES</Text>
            <Text style={s.emptySub}>Connect with us regarding your curated selections and future events.</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={() => navigation.navigate('Chat', {})}>
              <Text style={s.emptyBtnText}>CONTACT ATELIER</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: BRAND_BG },
  header:        { paddingHorizontal: 25, paddingTop: 60, paddingBottom: 25, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  headerTitle:   { fontSize: 16, fontWeight: '800', color: BRAND_DARK, letterSpacing: 3 },
  headerSub:     { fontSize: 11, color: '#999', marginTop: 5, fontWeight: '300' },
  
  shopCard:      { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: BRAND_DARK, 
    marginHorizontal: 20, marginTop: 25, marginBottom: 30, 
    borderRadius: 4, padding: 20, gap: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
  },
  shopIcon:      { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(197, 163, 115, 0.2)' },
  shopInfo:      { flex: 1 },
  shopName:      { fontSize: 12, fontWeight: '700', color: BRAND_GOLD, letterSpacing: 1.5 },
  shopSub:       { fontSize: 10, color: '#aaa', marginTop: 4, fontWeight: '300' },
  onlineDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', borderWidth: 1.5, borderColor: BRAND_DARK },

  sectionLabel:  { fontSize: 9, fontWeight: '800', color: '#bbb', paddingHorizontal: 25, marginBottom: 15, letterSpacing: 2 },
  list:          { paddingBottom: 40 },
  
  card:          { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    marginHorizontal: 20, padding: 18, marginBottom: 12, 
    borderRadius: 2, borderLeftWidth: 3, borderLeftColor: BRAND_GOLD,
    elevation: 1
  },
  cardIcon:      { width: 38, height: 38, borderRadius: 19, backgroundColor: BRAND_BG, justifyContent: 'center', alignItems: 'center' },
  cardInfo:      { flex: 1, marginLeft: 15 },
  cardTitle:     { fontSize: 12, fontWeight: '700', color: BRAND_DARK, letterSpacing: 0.5 },
  cardSub:       { fontSize: 10, color: '#aaa', marginTop: 4, fontWeight: '400' },
  
  statusRow:     { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  statusDot:     { width: 6, height: 6, borderRadius: 3 },
  statusText:    { fontSize: 8, fontWeight: '800', color: '#888', letterSpacing: 1 },
  
  cardRight:     { alignItems: 'flex-end' },
  cardDate:      { fontSize: 9, color: '#bbb', fontWeight: '700' },
  
  empty:         { alignItems: 'center', paddingTop: 80, paddingHorizontal: 45 },
  emptyTitle:    { fontSize: 11, fontWeight: '800', color: BRAND_DARK, marginTop: 20, letterSpacing: 2 },
  emptySub:      { fontSize: 11, color: '#999', marginTop: 10, textAlign: 'center', lineHeight: 18, fontWeight: '300' },
  emptyBtn:      { marginTop: 30, paddingVertical: 12, paddingHorizontal: 30, borderWidth: 1, borderColor: BRAND_DARK },
  emptyBtnText:  { color: BRAND_DARK, fontWeight: '800', fontSize: 10, letterSpacing: 2 },
});