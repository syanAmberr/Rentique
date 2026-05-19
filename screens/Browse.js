import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Image, TextInput, RefreshControl, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// THEME COLORS
const BRAND_GOLD = '#C5A373'; 
const BRAND_DARK = '#1A1110'; 
const BRAND_BG = '#F9F5F1';   
const PHP_SYMBOL = '₱';


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

const CATEGORIES = ['All','Wedding','Evening','Prom','Bridesmaid','Cocktail','Quinceañera'];

export default function BrowseScreen({ navigation, route }) {
  const [filtered, setFiltered] = useState(MOCK_GOWNS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(route.params?.category || 'All');
  const [wishlist, setWishlist] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    let results = MOCK_GOWNS;
    if (category !== 'All') {
      results = results.filter(g => g.category === category);
    }
    if (search.trim()) {
      results = results.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(results);
  }, [search, category]);

  const toggleWishlist = (id) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // Pretend to load
  };

  const renderGown = ({ item }) => (
    <View style={s.card}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => navigation.navigate('GownDetail', { gown: item })}
      >
        <Image source={item.img} style={s.img} />
        
        {!item.is_available && (
          <View style={s.bookedBadge}><Text style={s.bookedText}>RESERVED</Text></View>
        )}
        
        <TouchableOpacity style={s.heartBtn} onPress={() => toggleWishlist(item.id)}>
          <Ionicons
            name={wishlist.includes(item.id) ? 'heart' : 'heart-outline'}
            size={18}
            color={wishlist.includes(item.id) ? BRAND_GOLD : BRAND_DARK}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <TouchableOpacity style={s.info} onPress={() => navigation.navigate('GownDetail', { gown: item })}>
        <Text style={s.name} numberOfLines={1}>{item.name.toUpperCase()}</Text>
        <Text style={s.cat}>{item.category}</Text>
        <View style={s.footer}>
          <Text style={s.price}>{PHP_SYMBOL}{item.price.toLocaleString()}</Text>
          <View style={[s.avail, { backgroundColor: item.is_available ? '#FDF7EF' : '#eee' }]}>
            <Text style={[s.availText, { color: item.is_available ? BRAND_GOLD : '#999' }]}>
              {item.is_available ? 'Available' : 'Booked'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Search Header */}
      <View style={s.searchBox}>
        <Ionicons name="search-outline" size={18} color={BRAND_GOLD} />
        <TextInput
          style={s.searchInput}
          placeholder="Search our collection..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Filter */}
      <View style={{ marginBottom: 12 }}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={i => i}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.cats}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.chip, category === item && s.chipActive]}
              onPress={() => setCategory(item)}
            >
              <Text style={[s.chipText, category === item && s.chipTextActive]}>{item.toUpperCase()}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={s.hintRow}>
        <Ionicons name="sparkles-outline" size={12} color={BRAND_GOLD} />
        <Text style={s.hintText}>{filtered.length} CURATED PIECES FOUND</Text>
      </View>

      {/* Gown Grid */}
      <FlatList
        data={filtered}
        renderItem={renderGown}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={s.row}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND_GOLD} />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND_BG },
  searchBox: { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', marginTop: 50, marginHorizontal: 14, padding:15, borderWidth: 1, borderColor: '#eee' },
  searchInput: { flex:1, marginLeft:8, fontSize:14, color: BRAND_DARK },
  cats: { paddingHorizontal:14 },
  chip: { paddingHorizontal:18, paddingVertical:10, backgroundColor:'#fff', marginRight:8, borderWidth: 1, borderColor: '#eee' },
  chipActive: { backgroundColor: BRAND_DARK, borderColor: BRAND_DARK },
  chipText: { color:'#888', fontWeight:'700', fontSize:10, letterSpacing: 1 },
  chipTextActive: { color: BRAND_GOLD },
  hintRow: { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingBottom:10, gap:6 },
  hintText: { fontSize:9, color:'#aaa', fontWeight: '800', letterSpacing: 1 },
  list: { paddingHorizontal: 10, paddingBottom: 24 },
  row: { justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#fff', marginBottom: 18 },
  img: { width: '100%', height: 260, resizeMode: 'cover' },
  heartBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', padding: 6, borderRadius: 20 },
  bookedBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(26,17,16,0.8)', paddingHorizontal: 8, paddingVertical: 4 },
  bookedText: { color: BRAND_GOLD, fontSize: 8, fontWeight: 'bold', letterSpacing: 1 },
  info: { padding: 12 },
  name: { fontSize: 11, fontWeight: '800', color: BRAND_DARK, letterSpacing: 0.5 },
  cat: { fontSize: 9, color: '#bbb', marginTop: 2, fontStyle: 'italic' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  price: { fontSize: 13, fontWeight: '400', color: BRAND_DARK },
  avail: { paddingHorizontal: 6, paddingVertical: 2 },
  availText: { fontSize: 8, fontWeight: '900', textTransform: 'uppercase' },
});