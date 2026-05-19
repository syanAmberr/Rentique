import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Image, Dimensions, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AvailabilityCalendar from './AvailabilityCalendar';

const { width } = Dimensions.get('window');

const BRAND_GOLD = '#C5A373'; 
const BRAND_DARK = '#1A1110'; 
const BRAND_BG = '#F9F5F1';   

export default function GownDetailScreen({ navigation, route }) {
  const { gown } = route.params;
  const [activeTab, setActiveTab] = useState('details');
  const [wishlisted, setWishlisted] = useState(false);

  const TABS = [
    { id: 'details',  label: 'DESCRIPTION' },
    { id: 'calendar', label: 'AVAILABILITY' },
  ];

  const formatPHP = (price) => `₱${price.toLocaleString()}`;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. TOP CONTROLS (Floating over image) */}
      <View style={s.headerOverlay}>
        <TouchableOpacity style={s.roundBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={BRAND_GOLD} />
        </TouchableOpacity>
        <TouchableOpacity style={s.roundBtn} onPress={() => setWishlisted(!wishlisted)}>
          <Ionicons name={wishlisted ? "heart" : "heart-outline"} size={22} color={BRAND_GOLD} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. FIXED HERO IMAGE */}
        <Image source={gown.img || { uri: gown.image_url }} style={s.image} />

        {/* 3. THE FLOATING CONTENT CARD */}
        <View style={s.contentWrapper}>
          <View style={s.dragHandle} />
          
          <View style={s.nameBar}>
            <Text style={s.categoryText}>{gown.category.toUpperCase()}</Text>
            <Text style={s.gownName}>{gown.name.toUpperCase()}</Text>
            <View style={s.priceRow}>
              <Text style={s.priceText}>{formatPHP(gown.price)}</Text>
              <Text style={s.priceSub}> / RENTAL</Text>
            </View>
          </View>

          {/* STICKY TABS LOGIC */}
          <View style={s.tabs}>
            {TABS.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[s.tab, activeTab === t.id && s.tabActive]}
                onPress={() => setActiveTab(t.id)}
              >
                <Text style={[s.tabText, activeTab === t.id && s.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* TAB CONTENT */}
          <View style={s.tabBody}>
            {activeTab === 'details' ? (
              <View>
                <Text style={s.sectionTitle}>THE COLLECTION</Text>
                <Text style={s.description}>
                  {gown.description || "An exquisite piece from our premium collection, designed with meticulous attention to detail and crafted from the finest materials to ensure you look breathtaking on your special day."}
                </Text>

                <View style={s.specGrid}>
                  <View style={s.specItem}>
                    <Ionicons name="shirt-outline" size={18} color={BRAND_GOLD} />
                    <Text style={s.specLabel}>SIZE</Text>
                    <Text style={s.specVal}>{gown.size || 'Small - Medium'}</Text>
                  </View>
                  <View style={s.specItem}>
                    <Ionicons name="color-palette-outline" size={18} color={BRAND_GOLD} />
                    <Text style={s.specLabel}>COLOR</Text>
                    <Text style={s.specVal}>{gown.color || 'Default'}</Text>
                  </View>
                  <View style={s.specItem}>
                    <Ionicons name="sparkles-outline" size={18} color={BRAND_GOLD} />
                    <Text style={s.specLabel}>CONDITION</Text>
                    <Text style={s.specVal}>Pristine</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <Text style={s.sectionTitle}>LIVE AVAILABILITY</Text>
                <AvailabilityCalendar gownName={gown.name} />
              </View>
            )}
          </View>

          {/* PADDING FOR FOOTER */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* 4. FIXED BOOKING FOOTER */}
      <View style={s.footer}>
        <TouchableOpacity 
          style={s.bookBtn}
          onPress={() => navigation.navigate('BookNow', { gown })}
        >
          <Text style={s.bookBtnText}>BOOK RESERVATION</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerOverlay: {
    position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20,
  },
  roundBtn: {
    width: 45, height: 45, borderRadius: 25, 
    backgroundColor: 'rgba(26,17,16,0.85)',
    justifyContent: 'center', alignItems: 'center',
  },
  image: { width, height: width * 1.3, resizeMode: 'cover' },
  
  contentWrapper: {
    marginTop: -35,
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandle: {
    width: 40, height: 4, backgroundColor: '#eee', 
    borderRadius: 2, alignSelf: 'center', marginBottom: 20
  },
  nameBar: { paddingHorizontal: 25, marginBottom: 20 },
  categoryText: { fontSize: 10, color: BRAND_GOLD, fontWeight: '800', letterSpacing: 2 },
  gownName: { fontSize: 24, fontWeight: '300', color: BRAND_DARK, marginTop: 5, letterSpacing: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  priceText: { fontSize: 20, color: BRAND_DARK, fontWeight: '600' },
  priceSub: { fontSize: 10, color: '#aaa', fontWeight: '700' },

  tabs: { 
    flexDirection: 'row', 
    paddingHorizontal: 25, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    marginTop: 10
  },
  tab: { marginRight: 30, paddingVertical: 15, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: BRAND_GOLD },
  tabText: { fontSize: 10, fontWeight: '800', color: '#bbb', letterSpacing: 1 },
  tabTextActive: { color: BRAND_DARK },

  tabBody: { padding: 25 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: BRAND_DARK, letterSpacing: 1.5, marginBottom: 15 },
  description: { fontSize: 14, color: '#666', lineHeight: 24, fontWeight: '300' },
  
  specGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  specItem: { flex: 1, alignItems: 'center' },
  specLabel: { fontSize: 8, color: '#aaa', fontWeight: '800', marginTop: 8, letterSpacing: 1 },
  specVal: { fontSize: 12, color: BRAND_DARK, fontWeight: '600', marginTop: 2 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 35, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#f5f5f5'
  },
  bookBtn: {
    backgroundColor: BRAND_DARK, 
    paddingVertical: 18, 
    alignItems: 'center',
  },
  bookBtnText: { color: BRAND_GOLD, fontWeight: '800', fontSize: 11, letterSpacing: 2 },
});