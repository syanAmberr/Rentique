import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- BRAND CONSTANTS ---
const BRAND_GOLD = '#C5A373';
const BRAND_BG   = '#F9F5F1';
const BRAND_DARK = '#1A1110';
const BRAND_LIGHT_GOLD = '#EFE4D5';

// --- MOCK DATA ---
const MOCK_GOWNS = [
  { id: '1', name: 'Elegant White Ballgown', category: 'Wedding', price: 15000, is_available: true, img: require('../assets/gown1.webp') },
  { id: '2', name: 'Rose Satin Evening Gown', category: 'Evening', price: 12500, is_available: false, img: require('../assets/gown2.webp') },
  { id: '3', name: 'Royal Blue Prom Dress', category: 'Prom', price: 8500, is_available: true, img: require('../assets/gown3.webp') },
  { id: '4', name: 'Champagne Bridesmaid', category: 'Bridesmaid', price: 7000, is_available: true, img: require('../assets/gown4.webp') },
  { id: '5', name: 'Black Cocktail Dress', category: 'Cocktail', price: 5500, is_available: true, img: require('../assets/gown5.webp') },
  { id: '6', name: 'Princess Quinceañera', category: 'Quinceañera', price: 18000, is_available: true, img: require('../assets/gown6.webp') },
  { id: '7', name: 'Emerald Wrap Gown', category: 'Evening', price: 9500, is_available: true, img: require('../assets/gown7.webp') },
  { id: '8', name: 'Lavender A-Line Gown', category: 'Prom', price: 8000, is_available: true, img: require('../assets/gown8.webp') },
];

const BANNERS = [
  { id: '1', title: 'New Arrivals', sub: 'Fresh gowns for every occasion', color: BRAND_GOLD, icon: 'sparkles', bg: '#F2EBE1' },
  { id: '2', title: 'Wedding Collection', sub: 'Elegant designs for your big day', color: BRAND_DARK, icon: 'heart', bg: '#EAE3D9' },
  { id: '3', title: 'Exclusive Access', sub: 'Curated wardrobe at your door', color: BRAND_GOLD, icon: 'star', bg: '#FDF9F4' },
];

const QUICK = [
  { label: 'Browse', icon: 'shirt-outline', bg: BRAND_LIGHT_GOLD, color: BRAND_GOLD, screen: 'Browse' },
  { label: 'Orders', icon: 'receipt-outline', bg: '#E9EDF0', color: '#4A5568', screen: 'Orders' },
  { label: 'Messages', icon: 'chatbubbles-outline', bg: '#EAE7E4', color: BRAND_DARK, screen: 'Messages' },
  { label: 'Profile', icon: 'person-outline', bg: '#F5F0E9', color: BRAND_GOLD, screen: 'Profile' },
];

const CAT_ICONS = {
  Wedding: 'heart', Evening: 'moon', Prom: 'sparkles', Quinceañera: 'flower', Cocktail: 'wine', Bridesmaid: 'people', default: 'shirt'
};

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefresh] = useState(false);
  const [wishlist, setWishlist] = useState(['1', '3']);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const onRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
      setHasNotifications(true); 
    }, 1500);
  };

  const formatPHP = (price) => `₱${price.toLocaleString()}`;

  const featured = MOCK_GOWNS.filter((g) => g.is_available).slice(0, 4);
  const categories = [...new Set(MOCK_GOWNS.map((g) => g.category))];
  const banner = BANNERS[bannerIdx];

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER SECTION - FIXED NAVIGATION */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Rentique</Text>
          <Text style={s.subtitle}>Elegance Delivered</Text>
        </View>
        <TouchableOpacity
          style={s.notifBtn}
          onPress={() => {
            setHasNotifications(false); 
            // FIXED: Now navigating to Notifications screen
            navigation.navigate('Notifications'); 
          }}>
          <Ionicons name="notifications-outline" size={22} color={BRAND_DARK} />
          {hasNotifications && <View style={s.badge} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND_GOLD} />}
      >
        {/* ANIMATED BANNER */}
        <TouchableOpacity style={[s.banner, { backgroundColor: banner.bg }]} activeOpacity={0.9}>
          <View style={s.bannerContent}>
            <View style={[s.bannerIconWrap, { backgroundColor: banner.color }]}>
              <Ionicons name={banner.icon} size={26} color="#fff" />
            </View>
            <View style={s.bannerText}>
              <Text style={s.bannerTitle}>{banner.title.toUpperCase()}</Text>
              <Text style={s.bannerSub}>{banner.sub}</Text>
            </View>
          </View>
          <View style={s.dots}>
            {BANNERS.map((_, i) => (
              <View key={i} style={[s.dot, { backgroundColor: i === bannerIdx ? banner.color : '#ccc', width: i === bannerIdx ? 18 : 6 }]} />
            ))}
          </View>
        </TouchableOpacity>

        {/* QUICK NAVIGATION GRID */}
        <View style={s.quickGrid}>
          {QUICK.map((q) => (
            <TouchableOpacity key={q.label} style={s.quickCard} onPress={() => navigation.navigate(q.screen)}>
              <View style={[s.quickIcon, { backgroundColor: q.bg }]}>
                <Ionicons name={q.icon} size={24} color={q.color} />
              </View>
              <Text style={s.quickLabel}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CATEGORIES SECTION */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Browse Styles</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catList}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat} style={s.catCard} onPress={() => navigation.navigate('Browse', { category: cat })}>
              <Ionicons name={CAT_ICONS[cat] || CAT_ICONS.default} size={24} color={BRAND_GOLD} />
              <Text style={s.catLabel}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FEATURED GOWNS GRID */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Featured Collections</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Browse')}>
            <Text style={s.seeAll}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.featuredList}>
          {featured.map((gown) => (
            <TouchableOpacity key={gown.id} style={s.gownCard} onPress={() => navigation.navigate('GownDetail', { gown })}>
              <Image source={gown.img} style={s.gownImg} />
              <TouchableOpacity style={s.heartBtn} onPress={() => toggleWishlist(gown.id)}>
                <Ionicons name={wishlist.includes(gown.id) ? 'heart' : 'heart-outline'} size={18} color={wishlist.includes(gown.id) ? BRAND_GOLD : '#ccc'} />
              </TouchableOpacity>
              <View style={s.gownInfo}>
                <Text style={s.gownName} numberOfLines={1}>{gown.name.toUpperCase()}</Text>
                <Text style={s.gownPrice}>{formatPHP(gown.price)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PROMO BOX */}
        <View style={s.promo}>
          <Text style={s.promoEyebrow}>EXCLUSIVE OFFER</Text>
          <Text style={s.promoTitle}>The Gown of your dreams is one click away.</Text>
          <Text style={s.promoSub}>Use code: RENTIQUE26</Text>
          <TouchableOpacity style={s.promoBtn} onPress={() => navigation.navigate('Browse')}>
            <Text style={s.promoBtnText}>DISCOVER MORE</Text>
          </TouchableOpacity>
        </View>

        {/* RECENTLY ADDED LIST */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Recently Added</Text>
        </View>
        {MOCK_GOWNS.slice(-3).reverse().map((gown) => (
          <TouchableOpacity key={gown.id} style={s.listCard} onPress={() => navigation.navigate('GownDetail', { gown })}>
            <Image source={gown.img} style={s.listImg} />
            <View style={s.listInfo}>
              <Text style={s.listName}>{gown.name.toUpperCase()}</Text>
              <Text style={s.listCat}>{gown.category}</Text>
              <Text style={s.listPrice}>{formatPHP(gown.price)} / day</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={BRAND_GOLD} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND_BG },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  greeting: { fontSize: 22, fontWeight: '300', color: BRAND_DARK, letterSpacing: 4, textTransform: 'uppercase' },
  subtitle: { fontSize: 10, color: '#aaa', letterSpacing: 1, marginTop: 2 },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: BRAND_GOLD,
    borderWidth: 2,
    borderColor: '#fff',
  },
  banner: { margin: 16, padding: 25, borderWidth: 1, borderColor: '#eee' },
  bannerContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  bannerIconWrap: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: '800', letterSpacing: 1, color: BRAND_DARK },
  bannerSub: { fontSize: 10, color: '#888', marginTop: 4 },
  dots: { flexDirection: 'row', gap: 4, justifyContent: 'center', marginTop: 15 },
  dot: { height: 2 },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15 },
  quickCard: { alignItems: 'center', width: '25%' },
  quickIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 10, fontWeight: '700', color: BRAND_DARK, letterSpacing: 0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: '300', color: BRAND_DARK, letterSpacing: 2, textTransform: 'uppercase' },
  seeAll: { color: BRAND_GOLD, fontWeight: '800', fontSize: 9, letterSpacing: 1 },
  catList: { paddingHorizontal: 16, gap: 12 },
  catCard: { alignItems: 'center', backgroundColor: '#fff', padding: 18, minWidth: 95, borderWidth: 1, borderColor: '#eee' },
  catLabel: { fontSize: 9, fontWeight: '800', color: BRAND_DARK, textTransform: 'uppercase', marginTop: 8 },
  featuredList: { paddingHorizontal: 16, gap: 16 },
  gownCard: { width: width * 0.48, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  gownImg: { width: '100%', height: 260, resizeMode: 'cover' },
  heartBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8 },
  gownInfo: { padding: 12 },
  gownName: { fontSize: 11, fontWeight: '800', color: BRAND_DARK },
  gownPrice: { fontSize: 13, color: BRAND_GOLD, marginTop: 4, fontWeight: '600' },
  promo: { backgroundColor: BRAND_DARK, margin: 16, padding: 40, alignItems: 'center' },
  promoEyebrow: { fontSize: 9, color: BRAND_GOLD, fontWeight: '800', letterSpacing: 2, marginBottom: 12 },
  promoTitle: { fontSize: 19, color: '#fff', fontWeight: '300', textAlign: 'center', lineHeight: 26 },
  promoSub: { fontSize: 10, color: '#666', marginTop: 12 },
  promoBtn: { backgroundColor: BRAND_GOLD, paddingHorizontal: 25, paddingVertical: 14, marginTop: 25 },
  promoBtnText: { color: '#fff', fontWeight: '800', fontSize: 10, letterSpacing: 1 },
  listCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 1, padding: 15, borderWidth: 1, borderColor: '#f9f9f9' },
  listImg: { width: 55, height: 70, resizeMode: 'cover' },
  listInfo: { flex: 1, marginLeft: 20 },
  listName: { fontSize: 12, fontWeight: '800', color: BRAND_DARK },
  listCat: { fontSize: 10, color: '#aaa', marginVertical: 3 },
  listPrice: { fontSize: 12, color: BRAND_GOLD, fontWeight: '600' },
});