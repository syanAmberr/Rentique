import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_GOLD = '#C5A373';
const BRAND_DARK = '#1A1110';
const BRAND_BG   = '#F9F5F1';

export default function OrdersScreen({ route, navigation }) {
  const [filter, setFilter] = useState('ALL');
  const [cancellingId, setCancellingId] = useState(null);
  const [bookings, setBookings] = useState([]);

  // --- PERSISTENT ORDER LOGIC ---
  useEffect(() => {
    if (route.params?.newBooking) {
      const { newBooking } = route.params;
      
      setBookings(prev => {
        // Check if ID already exists to prevent double-adding on re-renders
        const exists = prev.some(b => b.id === newBooking.id);
        if (exists) return prev;
        
        // Add new booking to the top of the existing list
        return [newBooking, ...prev];
      });

      // CRITICAL: Clear the params so the same booking doesn't 
      // trigger the effect again if the screen refreshes
      navigation.setParams({ newBooking: undefined });
    }
  }, [route.params?.newBooking]);

  const handleCancel = (id) => {
    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: () => {
            setCancellingId(id);
            setTimeout(() => {
              setBookings(prev => prev.map(item => 
                item.id === id ? { ...item, status: 'CANCELLED' } : item
              ));
              setCancellingId(null);
            }, 4000);
          }
        }
      ]
    );
  };

  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.headerTitle}>MY RESERVATIONS</Text>
      </View>

      <View style={s.filterBar}>
        {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((status) => (
          <TouchableOpacity 
            key={status} 
            onPress={() => setFilter(status)}
            style={[s.filterTab, filter === status && s.filterTabActive]}
          >
            <Text style={[s.filterText, filter === status && s.filterTextActive]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <View style={s.emptyContainer}>
            <Ionicons name="receipt-outline" size={40} color="#ddd" />
            <Text style={s.emptyText}>No {filter.toLowerCase()} reservations.</Text>
          </View>
        ) : (
          filteredBookings.map((item) => (
            <View key={item.id} style={s.card}>
              <View style={s.cardTop}>
                <Image source={item.img} style={s.img} />
                <View style={s.details}>
                  <View style={s.idRow}>
                    <Text style={s.orderId}>{item.id}</Text>
                    <View style={[
                      s.statusBadge, 
                      item.status === 'CANCELLED' && { backgroundColor: '#FEE2E2' }
                    ]}>
                      <Text style={[
                        s.statusText,
                        item.status === 'CANCELLED' && { color: '#B91C1C' }
                      ]}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={s.name}>{item.gownName}</Text>
                  <Text style={s.price}>{item.totalPrice}</Text>
                </View>
              </View>

              <View style={s.cardActions}>
                {item.status !== 'CANCELLED' ? (
                  <>
                    <TouchableOpacity 
                      style={s.trackBtn}
                      onPress={() => navigation.navigate('TrackOrder', { orderId: item.id })}
                    >
                      <Text style={s.trackBtnText}>TRACK</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={s.cancelBtn} 
                      onPress={() => handleCancel(item.id)}
                      disabled={cancellingId === item.id}
                    >
                      {cancellingId === item.id ? (
                        <ActivityIndicator size="small" color="#B91C1C" />
                      ) : (
                        <Text style={s.cancelBtnText}>CANCEL</Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={s.cancelledNote}>This reservation has been cancelled.</Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND_BG },
  header: { paddingTop: 60, paddingBottom: 15, backgroundColor: '#fff', alignItems: 'center' },
  headerTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 3, color: BRAND_DARK },
  filterBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  filterTab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  filterTabActive: { borderBottomColor: BRAND_GOLD },
  filterText: { fontSize: 9, fontWeight: '800', color: '#aaa' },
  filterTextActive: { color: BRAND_GOLD },
  list: { padding: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#aaa', marginTop: 10, fontSize: 11, fontWeight: '600' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 20, elevation: 2 },
  cardTop: { flexDirection: 'row' },
  img: { width: 80, height: 100, backgroundColor: '#f0f0f0' },
  details: { flex: 1, marginLeft: 15 },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  orderId: { fontSize: 10, fontWeight: '800', color: BRAND_GOLD },
  statusBadge: { backgroundColor: '#F0F9FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 },
  statusText: { fontSize: 8, fontWeight: '900', color: '#0369A1' },
  name: { fontSize: 14, fontWeight: '700', color: BRAND_DARK },
  price: { fontSize: 12, fontWeight: '600', color: BRAND_GOLD, marginTop: 2 },
  cardActions: { flexDirection: 'row', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f5f5f5', justifyContent: 'space-between', alignItems: 'center' },
  trackBtn: { backgroundColor: BRAND_DARK, paddingHorizontal: 20, paddingVertical: 10 },
  trackBtnText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: '#eee' },
  cancelBtnText: { fontSize: 9, fontWeight: '800', color: '#B91C1C' },
  cancelledNote: { fontSize: 10, color: '#B91C1C', fontWeight: '600', fontStyle: 'italic' }
});