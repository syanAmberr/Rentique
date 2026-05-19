import React, { useState, useCallback, useEffect } from 'react'; 
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, Switch, Modal, TextInput, KeyboardAvoidingView,
  Platform, FlatList, Image, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../supabase';

// BRAND COLORS
const BRAND_GOLD  = '#C5A373';
const BRAND_DARK  = '#1A1110';
const BRAND_BG    = '#F9F5F1';
const EXCHANGE_RATE = 56; 
const AVATAR_COLORS = [BRAND_GOLD, '#8D775F', '#4A4A4A', '#D4AF37', '#B8860B', '#2F2F2F'];

const formatPHP = (amt) => `₱${amt.toLocaleString()}`;

function EditModal({ visible, profile, onClose, onSave }) {
  const [name,  setName ] = useState(profile.full_name||'');
  const [phone, setPhone] = useState(profile.phone||'');
  const [bio,   setBio   ] = useState(profile.bio||'');
  const [color, setColor] = useState(profile.avatar_color||BRAND_GOLD);

  useEffect(() => {
    setName(profile.full_name||''); 
    setPhone(profile.phone||'');
    setBio(profile.bio||''); 
    setColor(profile.avatar_color||BRAND_GOLD);
  }, [profile, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView style={em.overlay} behavior={Platform.OS==='ios'?'padding':'height'}>
        <View style={em.sheet}>
          <View style={em.header}>
            <Text style={em.title}>EDIT PROFILE</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#999" /></TouchableOpacity>
          </View>

          <Text style={em.label}>ATELIER THEME</Text>
          <View style={em.colors}>
            {AVATAR_COLORS.map(c => (
              <TouchableOpacity key={c} style={[em.colorDot, { backgroundColor:c }, color===c && em.colorSelected]} onPress={() => setColor(c)}>
                {color===c && <Ionicons name="checkmark" size={14} color="#fff" />}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={em.label}>FULL NAME</Text>
          <View style={em.inputRow}>
            <Ionicons name="person-outline" size={17} color={BRAND_GOLD} style={{ marginRight:8 }} />
            <TextInput style={em.input} value={name} onChangeText={setName} placeholder="Full Name" placeholderTextColor="#ccc" />
          </View>

          <Text style={em.label}>CONTACT</Text>
          <View style={em.inputRow}>
            <Ionicons name="call-outline" size={17} color={BRAND_GOLD} style={{ marginRight:8 }} />
            <TextInput style={em.input} value={phone} onChangeText={setPhone} placeholder="Phone Number" placeholderTextColor="#ccc" />
          </View>

          <Text style={em.label}>BIO</Text>
          <View style={em.inputRow}>
            <Ionicons name="document-text-outline" size={17} color={BRAND_GOLD} style={{ marginRight:8, marginTop:2 }} />
            <TextInput style={[em.input, em.multiline]} value={bio} onChangeText={setBio} placeholder="Style preferences..." multiline numberOfLines={3} placeholderTextColor="#ccc" />
          </View>

          <TouchableOpacity style={em.saveBtn} onPress={() => onSave({ full_name:name, phone, bio, avatar_color:color })}>
            <Text style={em.saveText}>UPDATE PROFILE</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function ProfileScreen({ navigation }) {
  const [user,         setUser       ] = useState(null);
  const [profile,      setProfile    ] = useState({ full_name:'', phone:'', bio:'', avatar_color:BRAND_GOLD });
  const [orderCount,   setOrderCount ] = useState(0);
  const [wishlist,     setWishlist   ] = useState([]);
  const [notifs,       setNotifs     ] = useState(true);
  const [activeTab,    setActiveTab  ] = useState('profile');
  const [editVisible, setEditVisible] = useState(false);

  useFocusEffect(useCallback(() => { loadAll(); }, []));

  const loadAll = async () => {
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) return;
    setUser(user);

    const { data:prof } = await supabase.from('profiles').select().eq('id', user.id).single();
    if (prof) setProfile(prof);

    const { count } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    setOrderCount(count || 0);

    const { data:wl } = await supabase.from('wishlist').select().eq('user_id', user.id);
    if (wl) {
      setWishlist(wl.map(w => {
        try { return { ...w, gown: JSON.parse(w.gown_data) }; } 
        catch { return null; }
      }).filter(Boolean));
    }
  };

  const saveProfile = async (upd) => {
    const { data:{ user:u } } = await supabase.auth.getUser();
    await supabase.from('profiles').upsert({ id:u?.id, ...upd });
    setProfile(upd);
    setEditVisible(false);
    Alert.alert('Success', 'Your profile has been updated.');
  };

  const removeWishlist = async (item) => {
    const { data:{ user:u } } = await supabase.auth.getUser();
    await supabase.from('wishlist').delete().eq('user_id', u.id).eq('gown_id', item.gown_id);
    setWishlist(w => w.filter(x => x.gown_id !== item.gown_id));
  };

  const handleSignOut = () => Alert.alert('Sign Out', 'Would you like to end your session?', [
    { text:'Cancel', style:'cancel' },
    { text:'Sign Out', style:'destructive', onPress: async () => { 
        await supabase.auth.signOut();
        navigation.replace('Login'); // Redirects to Login screen
      } 
    },
  ]);

  const displayName = profile.full_name || user?.email?.split('@')[0] || 'User';
  const initials    = displayName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
  const avatarColor = profile.avatar_color || BRAND_GOLD;

  const TABS = [
    { id:'profile',  label:'IDENTITY',  icon:'person-outline'  },
    { id:'wishlist', label:'WISHLIST',  icon:'heart-outline'    },
    { id:'settings', label:'SETTINGS',  icon:'settings-outline' },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />

      {/* LUXURY HEADER */}
      <View style={[s.header, { backgroundColor: BRAND_DARK }]}>
        <View style={s.headerInner}>
          <View style={[s.avatarWrap, { borderColor: avatarColor }]}>
            <Text style={[s.avatarText, { color: avatarColor }]}>{initials}</Text>
          </View>
          <View style={s.headerInfo}>
            <Text style={s.name}>{displayName.toUpperCase()}</Text>
            <Text style={s.email}>{user?.email}</Text>
            <View style={[s.memberBadge, { backgroundColor: avatarColor }]}>
               <Text style={s.memberBadgeText}>✦ GOLD MEMBER</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={s.editAvatarBtn} onPress={() => setEditVisible(true)}>
          <Ionicons name="pencil" size={14} color={avatarColor} />
          <Text style={[s.editAvatarText, { color: avatarColor }]}>EDIT PROFILE</Text>
        </TouchableOpacity>
      </View>

      <View style={s.statsRow}>
        {[
          { label:'RENTALS',  val:orderCount,    color:BRAND_DARK },
          { label:'WISHLIST', val:wishlist.length, color:BRAND_GOLD },
          { label:'REVIEWS',  val:0,               color:BRAND_DARK },
        ].map(st => (
          <View key={st.label} style={s.statItem}>
            <Text style={[s.statVal, { color:st.color }]}>{st.val}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>

      <View style={s.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t.id} style={[s.tab, activeTab===t.id && s.tabActive]} onPress={() => setActiveTab(t.id)}>
            <Text style={[s.tabText, activeTab===t.id && s.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'profile' && (
          <View>
            <View style={s.card}>
              <Text style={s.cardTitle}>Concierge Information</Text>
              {[
                { icon:'mail-outline',          label:'EMAIL ADDRESS',    val: user?.email },
                { icon:'call-outline',           label:'PRIMARY PHONE',    val: profile.phone || 'No contact provided' },
                { icon:'document-text-outline',  label:'STYLE BIO',       val: profile.bio   || 'No preferences listed' },
              ].map(f => (
                <View key={f.label} style={s.infoRow}>
                  <View style={s.infoIconWrap}><Ionicons name={f.icon} size={16} color={BRAND_GOLD} /></View>
                  <View style={s.infoContent}>
                    <Text style={s.infoLabel}>{f.label}</Text>
                    <Text style={s.infoVal}>{f.val}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>Quick Access</Text>
              {[
                { icon:'receipt-outline',       label:'MY RESERVATIONS',     onPress:()=>navigation.navigate('Orders')   },
                { icon:'chatbubbles-outline',   label:'CONCIERGE MESSAGES',  onPress:()=>navigation.navigate('Messages')  },
                { icon:'help-circle-outline',   label:'SUPPORT ATELIER',     onPress:()=>navigation.navigate('Chat',{})   },
              ].map((item,i,arr) => (
                <TouchableOpacity key={item.label} style={[s.menuRow, i<arr.length-1&&s.menuBorder]} onPress={item.onPress}>
                  <Ionicons name={item.icon} size={18} color={BRAND_DARK} />
                  <Text style={s.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={14} color="#ddd" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'wishlist' && (
          wishlist.length === 0 ? (
            <View style={s.emptyWish}>
              <Ionicons name="heart-outline" size={60} color="#ddd" />
              <Text style={s.emptyTitle}>NO SAVED PIECES</Text>
              <TouchableOpacity style={s.browseBtn} onPress={() => navigation.navigate('Browse')}>
                <Text style={s.browseBtnText}>EXPLORE CATALOG</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={wishlist}
              keyExtractor={item => item.gown_id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent:'space-between', marginBottom:15 }}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const g = item.gown || {};
                return (
                  <View style={s.wishCard}>
                    <Image source={{ uri:g.image_url }} style={s.wishImg} />
                    <TouchableOpacity style={s.wishHeart} onPress={() => removeWishlist(item)}>
                      <Ionicons name="heart" size={16} color={BRAND_GOLD} />
                    </TouchableOpacity>
                    <View style={s.wishInfo}>
                      <Text style={s.wishName} numberOfLines={1}>{g.name?.toUpperCase()}</Text>
                      <Text style={s.wishPrice}>{formatPHP(g.price * EXCHANGE_RATE)}</Text>
                      <TouchableOpacity style={s.wishViewBtn} onPress={() => navigation.navigate('GownDetail', { gown:g })}>
                        <Text style={s.wishViewText}>VIEW DETAILS</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          )
        )}

        {activeTab === 'settings' && (
          <View>
            <View style={s.card}>
              <Text style={s.cardTitle}>Preferences</Text>
              <View style={s.menuRow}>
                <Ionicons name="notifications-outline" size={18} color={BRAND_DARK} />
                <Text style={s.menuLabel}>PUSH NOTIFICATIONS</Text>
                <Switch value={notifs} onValueChange={setNotifs} trackColor={{ false:'#ddd', true:BRAND_GOLD }} thumbColor="#fff" />
              </View>
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>Account Management</Text>
              <TouchableOpacity style={s.menuRow} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={18} color="#f44336" />
                <Text style={[s.menuLabel, { color:'#f44336' }]}>SIGN OUT</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={{ height:30 }} />
      </ScrollView>

      <EditModal visible={editVisible} profile={profile} onClose={() => setEditVisible(false)} onSave={saveProfile} />
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex:1, backgroundColor: BRAND_BG },
  header:         { paddingTop:60, paddingBottom:30, paddingHorizontal:25 },
  headerInner:    { flexDirection:'row', alignItems:'center', gap:20 },
  avatarWrap:     { width:70, height:70, borderRadius:35, backgroundColor:'rgba(255, 255, 255, 0.05)', justifyContent:'center', alignItems:'center', borderWidth:1 },
  avatarText:     { fontSize:22, fontWeight:'700' },
  headerInfo:     { flex:1 },
  name:           { fontSize:16, fontWeight:'700', color:'#fff', letterSpacing:2 },
  email:          { fontSize:12, color:'#aaa', marginTop:4, fontWeight:'300' },
  memberBadge:    { alignSelf:'flex-start', marginTop:8, paddingHorizontal:8, paddingVertical:3, borderRadius:2 },
  memberBadgeText:{ color:BRAND_DARK, fontSize:8, fontWeight:'800', letterSpacing:1 },
  
  editAvatarBtn: { flexDirection:'row', alignItems:'center', alignSelf:'flex-end', gap:6, paddingVertical:8 },
  editAvatarText:{ fontSize:10, fontWeight:'700', letterSpacing:1 },

  statsRow:       { flexDirection:'row', backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#eee' },
  statItem:       { flex:1, alignItems:'center', paddingVertical:20, borderRightWidth:1, borderRightColor:'#f5f5f5' },
  statVal:        { fontSize:18, fontWeight:'700', letterSpacing:1 },
  statLabel:      { fontSize:9, color:'#aaa', marginTop:5, fontWeight:'700', letterSpacing:1 },

  tabs:           { flexDirection:'row', backgroundColor:'#fff' },
  tab:            { flex:1, alignItems:'center', paddingVertical:15 },
  tabActive:      { borderBottomWidth:2, borderBottomColor:BRAND_GOLD },
  tabText:        { fontSize:10, color:'#aaa', fontWeight:'700', letterSpacing:1.5 },
  tabTextActive:  { color:BRAND_DARK },

  content:        { padding:20 },
  card:           { backgroundColor:'#fff', borderRadius:4, padding:20, marginBottom:15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  cardTitle:      { fontSize:11, fontWeight:'800', color:BRAND_GOLD, marginBottom:20, letterSpacing:1.5, textTransform:'uppercase' },
  
  infoRow:        { flexDirection:'row', alignItems:'center', marginBottom:18 },
  infoIconWrap:   { width:32, height:32, borderRadius:16, backgroundColor:BRAND_BG, justifyContent:'center', alignItems:'center', marginRight:15 },
  infoContent:    { flex:1 },
  infoLabel:      { fontSize:9, color:'#bbb', fontWeight:'700', letterSpacing:0.5 },
  infoVal:        { fontSize:13, color:BRAND_DARK, fontWeight:'400', marginTop:2 },

  menuRow:        { flexDirection:'row', alignItems:'center', paddingVertical:15, gap:15 },
  menuBorder:     { borderBottomWidth:1, borderBottomColor:'#f9f9f9' },
  menuLabel:      { flex:1, fontSize:11, color:BRAND_DARK, fontWeight:'600', letterSpacing:1 },

  emptyWish:      { alignItems:'center', paddingTop:60 },
  emptyTitle:     { fontSize:11, fontWeight:'700', color:'#bbb', marginTop:20, letterSpacing:2 },
  browseBtn:      { marginTop:25, paddingVertical:12, paddingHorizontal:30, borderWidth:1, borderColor:BRAND_DARK },
  browseBtnText:  { color:BRAND_DARK, fontWeight:'700', fontSize:10, letterSpacing:1 },

  wishCard:       { width:'48%', backgroundColor:'#fff', borderRadius:2, overflow:'hidden', borderBottomWidth: 1, borderBottomColor: '#eee' },
  wishImg:        { width:'100%', height:180, resizeMode:'cover' },
  wishHeart:      { position:'absolute', top:10, right:10, backgroundColor:'rgba(255,255,255,0.8)', padding:6, borderRadius:15 },
  wishInfo:       { padding:12 },
  wishName:       { fontSize:10, fontWeight:'700', color:BRAND_DARK, letterSpacing:0.5 },
  wishPrice:      { fontSize:11, fontWeight:'700', color:BRAND_GOLD, marginTop:5 },
  wishViewBtn:    { marginTop:10, paddingVertical:8, backgroundColor:BRAND_DARK, alignItems:'center' },
  wishViewText:   { color:'#fff', fontSize:9, fontWeight:'700', letterSpacing:1 },
});

const em = StyleSheet.create({
  overlay:        { flex:1, backgroundColor:'rgba(26, 17, 16, 0.9)', justifyContent:'flex-end' },
  sheet:          { backgroundColor:'#fff', borderTopLeftRadius:20, borderTopRightRadius:20, padding:25, maxHeight:'85%' },
  header:         { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  title:          { fontSize:14, fontWeight:'700', color:BRAND_DARK, letterSpacing:2 },
  label:          { fontSize:9, fontWeight:'800', color:'#bbb', marginBottom:8, marginTop:15, letterSpacing:1.5 },
  colors:         { flexDirection:'row', gap:12 },
  colorDot:       { width:34, height:34, borderRadius:17, justifyContent:'center', alignItems:'center' },
  colorSelected:  { borderWidth:2, borderColor:BRAND_DARK },
  inputRow:       { flexDirection:'row', alignItems:'center', backgroundColor:BRAND_BG, borderRadius:4, padding:15 },
  input:          { flex:1, fontSize:14, color:BRAND_DARK },
  multiline:      { height:80, textAlignVertical:'top' },
  saveBtn:        { backgroundColor:BRAND_DARK, padding:18, borderRadius:4, marginTop:25, alignItems:'center' },
  saveText:       { color:'#fff', fontWeight:'700', fontSize:12, letterSpacing:2 },
});