import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, StatusBar, Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_GOLD = '#C5A373';
const BRAND_DARK = '#1A1110';
const BRAND_BG   = '#F9F5F1';

const TRACKING_STEPS = [
  { title: 'Confirmed', desc: 'Reservation secured', icon: 'checkmark-circle' },
  { title: 'Fitting', desc: 'Final adjustments', icon: 'cut' },
  { title: 'Out for Delivery', desc: 'Courier is in transit', icon: 'bicycle' },
  { title: 'Arrived', desc: 'Ready for pickup/at door', icon: 'home' },
];

const PRETEND_JOURNEY = [
  "Boutique HQ: Bacolod City",
  "Transit: Lacson Street",
  "Sorting: Mandalagan Hub",
  "Near You: Villa Angela",
  "Delivered: Destination Arrived"
];

export default function TrackOrderScreen({ route, navigation }) {
  // Catching the orderId passed from the Orders Screen
  const { orderId } = route.params || { orderId: 'BK-0000' };
  
  const [currentStep, setCurrentStep] = useState(2); 
  const [locationIndex, setLocationIndex] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 1. Simulation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setLocationIndex((prev) => {
        if (prev < PRETEND_JOURNEY.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 2. Visual Pulse Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (locationIndex === PRETEND_JOURNEY.length - 1) setCurrentStep(3);
  }, [locationIndex]);

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={BRAND_DARK} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>LIVE TRACKING</Text>
          <Text style={s.headerSub}>{orderId}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.mapContainer}>
          <View style={s.mapPlaceholder}>
             <View style={s.gridLineH} />
             <View style={s.gridLineV} />
             <Animated.View style={[s.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
             <View style={s.courierMarker}>
                <Ionicons name="bicycle" size={24} color="#fff" />
             </View>
             <Text style={s.liveTag}>● LIVE GPS</Text>
          </View>

          <View style={s.locationCard}>
             <View style={s.locIcon}>
                <Ionicons name="navigate" size={18} color={BRAND_GOLD} />
             </View>
             <View style={{ flex: 1 }}>
                <Text style={s.locLabel}>CURRENT LOCATION</Text>
                <Text style={s.locText}>{PRETEND_JOURNEY[locationIndex]}</Text>
             </View>
          </View>
        </View>

        <View style={s.timelineSection}>
          <Text style={s.sectionTitle}>SHIPMENT PROGRESS</Text>
          {TRACKING_STEPS.map((step, index) => {
            const isDone = index <= currentStep;
            const isLast = index === TRACKING_STEPS.length - 1;
            return (
              <View key={index} style={s.stepRow}>
                <View style={s.indicatorCol}>
                  <View style={[s.dot, isDone && s.dotActive]}>
                    {isDone && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  {!isLast && <View style={[s.line, isDone && s.lineActive]} />}
                </View>
                <View style={s.stepContent}>
                  <Text style={[s.stepTitle, isDone && s.textActive]}>{step.title.toUpperCase()}</Text>
                  <Text style={s.stepDesc}>{step.desc}</Text>
                </View>
                <Ionicons name={step.icon} size={20} color={isDone ? BRAND_GOLD : '#ddd'} />
              </View>
            );
          })}
        </View>

        <View style={s.courierCard}>
          <View style={s.avatar}>
             <Ionicons name="person" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={s.courierName}>Rachelle Dela Cruz</Text>
            <Text style={s.courierRole}>Personal Rentique Courier</Text>
          </View>
          <TouchableOpacity style={s.callBtn}>
            <Ionicons name="call" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND_BG },
  header: { 
    paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center'
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#999' },
  headerSub: { fontSize: 14, fontWeight: '700', color: BRAND_DARK },
  backBtn: { width: 40 },
  mapContainer: { padding: 20 },
  mapPlaceholder: { 
    height: 250, backgroundColor: '#E2E8F0', borderRadius: 2, 
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
    borderWidth: 1, borderColor: '#cbd5e1'
  },
  gridLineH: { position: 'absolute', width: '100%', height: 1, backgroundColor: '#cbd5e1', top: '50%' },
  gridLineV: { position: 'absolute', width: 1, height: '100%', backgroundColor: '#cbd5e1', left: '50%' },
  courierMarker: { backgroundColor: BRAND_DARK, padding: 12, borderRadius: 30, elevation: 5, zIndex: 5 },
  pulseCircle: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: BRAND_GOLD, opacity: 0.2 },
  liveTag: { position: 'absolute', top: 15, right: 15, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, fontSize: 8, fontWeight: '900', color: '#DC2626' },
  locationCard: {
    flexDirection: 'row', backgroundColor: '#fff', padding: 20, 
    alignItems: 'center', marginTop: -30, marginHorizontal: 20, 
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  locIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: BRAND_BG, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  locLabel: { fontSize: 8, color: '#aaa', fontWeight: '800', letterSpacing: 1 },
  locText: { fontSize: 13, fontWeight: '700', color: BRAND_DARK, marginTop: 2 },
  timelineSection: { padding: 30 },
  sectionTitle: { fontSize: 9, fontWeight: '900', color: '#bbb', letterSpacing: 2, marginBottom: 25 },
  stepRow: { flexDirection: 'row', height: 80 },
  indicatorCol: { alignItems: 'center', width: 30 },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  dotActive: { backgroundColor: BRAND_GOLD },
  line: { width: 2, flex: 1, backgroundColor: '#eee', marginTop: -2, marginBottom: -2 },
  lineActive: { backgroundColor: BRAND_GOLD },
  stepContent: { flex: 1, marginLeft: 15 },
  stepTitle: { fontSize: 11, fontWeight: '800', color: '#ccc' },
  textActive: { color: BRAND_DARK },
  stepDesc: { fontSize: 10, color: '#999', marginTop: 3 },
  courierCard: { 
    flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, 
    marginBottom: 40, padding: 20, alignItems: 'center', borderLeftWidth: 4, borderLeftColor: BRAND_GOLD
  },
  avatar: { width: 45, height: 45, backgroundColor: BRAND_DARK, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  courierName: { fontSize: 13, fontWeight: '800', color: BRAND_DARK },
  courierRole: { fontSize: 10, color: '#999', marginTop: 2 },
  callBtn: { backgroundColor: BRAND_DARK, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});