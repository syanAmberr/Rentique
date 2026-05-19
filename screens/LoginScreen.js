import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../supabase';

const { height } = Dimensions.get('window');

const BRAND_GOLD = '#D4AF37';
const BRAND_DARK = '#141111';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'login') {
        // --- SIGN IN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (error) throw error;
      } else {
        // --- SIGN UP LOGIC ---
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });
        if (error) throw error;
        Alert.alert(
          'Account Created',
          'Check your email for verification link!'
        );
        setActiveTab('login');
      }
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fillTestAccount = () => {
    setEmail('maria@example.com');
    setPassword('password123');
  };

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      {/* Top Branding Section */}
      <ImageBackground
        source={require('../assets/gown.gif')}
        style={styles.headerBackground}>
        <View style={styles.brandOverlay}>
          <Text style={styles.brandTitle}>RENTIQUE</Text>
          <Text style={styles.tagline}>
            Elevate your elegance, effortlessly.
          </Text>
        </View>
      </ImageBackground>

      {/* Auth Card Container */}
      <View style={styles.authCard}>
        {/* Tab Selection Row */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'login' && styles.activeTab]}
            onPress={() => setActiveTab('login')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'login'
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}>
              SIGN IN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
            onPress={() => setActiveTab('signup')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'signup'
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}>
              CREATE ACCOUNT
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Form */}
        <View style={styles.form}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            mode="flat"
            placeholder="maria@example.com"
            underlineColor="transparent"
            selectionColor={BRAND_GOLD}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            mode="flat"
            underlineColor="transparent"
            selectionColor={BRAND_GOLD}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={secureText ? 'eye' : 'eye-off'}
                onPress={() => setSecureText(!secureText)}
                color="#BDBDBD"
              />
            }
          />

          {/* Action Button */}
          <Button
            mode="contained"
            onPress={handleAuth}
            disabled={loading}
            style={styles.signInButton}
            labelStyle={styles.signInButtonLabel}>
            {loading ? (
              <ActivityIndicator color={BRAND_GOLD} size="small" />
            ) : activeTab === 'login' ? (
              'SIGN IN'
            ) : (
              'CREATE ACCOUNT'
            )}
          </Button>

          {/* Helper UI only shows in Login mode */}
          {activeTab === 'login' && (
            <TouchableOpacity
              style={styles.testAccountBox}
              onPress={fillTestAccount}
              activeOpacity={0.7}>
              <Text style={styles.testTitle}>TEST CREDENTIALS</Text>
              <Text style={styles.testCredentials}>
                maria@example.com / password123
              </Text>
              <Text style={styles.testHint}>(Tap to auto-fill)</Text>
            </TouchableOpacity>
          )}

          {/* Demo Access Section */}
          <View style={styles.demoSection}>
            <Text style={styles.demoLabel}>DEMO ACCESS</Text>
            <View style={styles.demoRow}>
              <Button
                mode="outlined"
                style={styles.demoBtn}
                labelStyle={styles.demoBtnText}
                onPress={() =>
                  Alert.alert('Admin Mode', 'Admin Mode coming soon')
                }>
                Admin User
              </Button>
              <Button
                mode="outlined"
                style={styles.demoBtn}
                labelStyle={styles.demoBtnText}
                onPress={() =>
                  Alert.alert('Demo Mode', 'Demo Mode coming soon')
                }>
                Demo User
              </Button>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerBackground: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: '100%',
    paddingVertical: 30,
  },
  brandTitle: {
    fontSize: 42,
    color: BRAND_GOLD,
    letterSpacing: 8,
    fontWeight: '300',
  },
  tagline: {
    color: '#FFF',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    letterSpacing: 1,
  },

  authCard: {
    marginTop: -40,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#FFF',
    padding: 25,
    minHeight: height * 0.6,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: { flex: 1, paddingBottom: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: BRAND_GOLD },
  tabText: { fontWeight: 'bold', letterSpacing: 1 },
  activeTabText: { color: BRAND_GOLD },
  inactiveTabText: { color: '#BDBDBD' },

  form: { flex: 1 },
  label: {
    color: '#616161',
    fontWeight: '700',
    fontSize: 11,
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: { backgroundColor: '#F7F7F7', marginBottom: 20, height: 55 },

  signInButton: {
    backgroundColor: BRAND_DARK,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  signInButtonLabel: { color: BRAND_GOLD, fontWeight: '700', letterSpacing: 2 },

  testAccountBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F9F5F1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFE4D5',
    alignItems: 'center',
  },
  testTitle: {
    fontSize: 10,
    color: '#888',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  testCredentials: { color: BRAND_GOLD, fontSize: 13, fontWeight: '600' },
  testHint: { fontSize: 10, color: '#AAA', fontStyle: 'italic', marginTop: 2 },

  demoSection: { marginTop: 40, alignItems: 'center' },
  demoLabel: {
    color: '#BDBDBD',
    fontSize: 11,
    marginBottom: 15,
    letterSpacing: 2,
    fontWeight: '700',
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  demoBtn: { flex: 0.48, borderColor: '#E0E0E0', borderRadius: 8 },
  demoBtnText: { color: '#616161', fontSize: 12, textTransform: 'none' },
});

export default LoginScreen;
