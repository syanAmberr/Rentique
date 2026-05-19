import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, Image, ActivityIndicator, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

const BRAND_GOLD = '#C5A373';
const BRAND_DARK = '#1A1110';
const BRAND_BG   = '#F9F5F1';
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const fmtDate = (d) => d
  ? `${MONTHS[d.getMonth()].toUpperCase().slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`
  : 'SELECT DATE';

export default function BookNowScreen({ navigation, route }) {
  const { gown } = route.params;
  const scrollRef = useRef(null);

  const [selectedRange, setSelectedRange] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [fittingDate, setFittingDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('calendar');

  const onDayPress = (day) => {
    const dateString = day.dateString;
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateString);
      setEndDate(null);
      setSelectedRange({
        [dateString]: { startingDay: true, color: BRAND_DARK, textColor: 'white' }
      });
    } else {
      if (dateString < startDate) {
        setStartDate(dateString);
        setSelectedRange({ [dateString]: { startingDay: true, color: BRAND_DARK, textColor: 'white' } });
      } else {
        setEndDate(dateString);
        let range = {};
        let start = new Date(startDate);
        let end = new Date(dateString);
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          let str = d.toISOString().split('T')[0];
          range[str] = {
            color: str === startDate || str === dateString ? BRAND_DARK : BRAND_GOLD,
            textColor: 'white',
            startingDay: str === startDate,
            endingDay: str === dateString
          };
        }
        setSelectedRange(range);
      }
    }
  };

  const totalDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    return Math.ceil(Math.abs(e - s) / 86400000) + 1;
  };

  const totalPrice = () => (totalDays() * gown.price);
  const formatPHP = (amt) => `₱${amt.toLocaleString()}`;

  const goToStep = (nextStep) => {
    setStep(nextStep);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  // --- UPDATED LOGIC TO SEND DATA TO ORDERS ---
  const handleBooking = () => {
    setLoading(true);

    const newOrderData = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      gownName: gown.name,
      category: gown.category,
      img: gown.img,
      pickupDate: startDate,
      returnDate: endDate,
      totalPrice: formatPHP(totalPrice()),
      status: 'CONFIRMED'
    };

    setTimeout(() => {
      setLoading(false);
      // We navigate to the "Main" Tab Navigator, then the "Orders" screen
      navigation.navigate('Main', {
        screen: 'Orders',
        params: { newBooking: newOrderData }
      });
      
      Alert.alert('SUCCESS', 'Your reservation has been added to My Orders.');
    }, 1500);
  };

  const fittingOptions = [];
  const cur = new Date();
  for (let i = 1; i <= 6; i++) {
    const d = new Date();
    d.setDate(cur.getDate() + i);
    if (d.getDay() !== 0) fittingOptions.push(d);
  }

  return (
    <View style={{ flex: 1, backgroundColor: BRAND_BG }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView ref={scrollRef} style={s.container} showsVerticalScrollIndicator={false}>

        <View style={s.gownCard}>
          <Image source={gown.img} style={s.gownImg} />
          <View style={s.gownInfo}>
            <Text style={s.gownName}>{gown.name.toUpperCase()}</Text>
            <Text style={s.gownCat}>{gown.category.toUpperCase()}</Text>
            <Text style={s.gownPrice}>{formatPHP(gown.price)}<Text style={s.perDay}> / DAY</Text></Text>
          </View>
        </View>

        <View style={s.steps}>
          {['calendar', 'fitting', 'summary'].map((id, i) => (
            <React.Fragment key={id}>
              <View style={[
                s.stepDot,
                step === id && s.stepDotActive,
                (step === 'fitting' && i === 0) || (step === 'summary' && i <= 1) ? s.stepDotDone : null
              ]}>
                <Text style={s.stepNum}>{i + 1}</Text>
              </View>
              {i < 2 && <View style={s.stepLine} />}
            </React.Fragment>
          ))}
        </View>

        {step === 'calendar' && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>PICK YOUR DATES</Text>
            <View style={s.calendarWrapper}>
              <Calendar
                markingType={'period'}
                markedDates={selectedRange}
                onDayPress={onDayPress}
                theme={{
                  calendarBackground: '#fff',
                  todayTextColor: BRAND_GOLD,
                  dayTextColor: BRAND_DARK,
                  monthTextColor: BRAND_DARK,
                  textSectionTitleColor: '#bbb',
                  arrowColor: BRAND_GOLD,
                }}
              />
            </View>
            <TouchableOpacity
              style={[s.primaryBtn, !endDate && s.primaryBtnDisabled]}
              onPress={() => endDate && goToStep('fitting')}
            >
              <Text style={s.primaryBtnText}>CONTINUE TO FITTING →</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'fitting' && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>SCHEDULE A FITTING</Text>
            <View style={s.fittingGrid}>
              {fittingOptions.map((date, i) => {
                const sel = fittingDate && fittingDate.toDateString() === date.toDateString();
                return (
                  <TouchableOpacity
                    key={i}
                    style={[s.fittingCard, sel && s.fittingCardSel]}
                    onPress={() => setFittingDate(date)}
                  >
                    <Text style={[s.fittingDay, sel && s.fittingTextSel]}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </Text>
                    <Text style={[s.fittingNum, sel && s.fittingTextSel]}>{date.getDate()}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TextInput
              style={s.notes}
              placeholder="Special requests (e.g. adjust hem)..."
              placeholderTextColor="#aaa"
              multiline
              value={notes}
              onChangeText={setNotes}
            />
            <View style={s.navBtns}>
              <TouchableOpacity style={s.backBtn} onPress={() => goToStep('calendar')}>
                <Text style={s.backBtnText}>BACK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.primaryBtn, !fittingDate && s.primaryBtnDisabled]}
                onPress={() => fittingDate && goToStep('summary')}
              >
                <Text style={s.primaryBtnText}>REVIEW →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 'summary' && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>REVIEW & CONFIRM</Text>
            <View style={s.summaryCard}>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>RENTAL PERIOD</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.summaryVal}>{totalDays()} DAYS</Text>
                  <Text style={{ fontSize: 9, color: '#aaa' }}>{startDate} to {endDate}</Text>
                </View>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>FITTING DATE</Text>
                <Text style={s.summaryVal}>{fmtDate(fittingDate)}</Text>
              </View>
              <View style={s.divider} />
              <View style={s.summaryRow}>
                <Text style={s.totalLabel}>TOTAL ESTIMATE</Text>
                <Text style={s.totalVal}>{formatPHP(totalPrice())}</Text>
              </View>
            </View>
            <View style={s.navBtns}>
              <TouchableOpacity style={s.backBtn} onPress={() => goToStep('fitting')}>
                <Text style={s.backBtnText}>EDIT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.primaryBtn, s.confirmBtn]} onPress={handleBooking} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>CONFIRM RESERVATION</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  gownCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 16, padding: 15, borderWidth: 1, borderColor: '#eee' },
  gownImg: { width: 80, height: 100, borderRadius: 0, resizeMode: 'cover' },
  gownInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  gownName: { fontWeight: '800', fontSize: 13, color: BRAND_DARK, letterSpacing: 0.5 },
  gownCat: { fontSize: 9, color: '#bbb', marginTop: 4, letterSpacing: 1, fontStyle: 'italic' },
  gownPrice: { color: BRAND_GOLD, fontWeight: '700', marginTop: 10, fontSize: 16 },
  perDay: { color: '#bbb', fontSize: 9, fontWeight: '400' },
  steps: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 50, marginVertical: 30 },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: BRAND_DARK },
  stepDotDone: { backgroundColor: BRAND_GOLD },
  stepNum: { color: '#fff', fontSize: 10, fontWeight: '800' },
  stepLine: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  section: { marginHorizontal: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: BRAND_DARK, marginBottom: 20, letterSpacing: 1.5 },
  calendarWrapper: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', marginBottom: 20 },
  fittingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  fittingCard: { width: '31%', padding: 15, borderWidth: 1, borderColor: '#eee', alignItems: 'center', backgroundColor: '#fff' },
  fittingCardSel: { backgroundColor: BRAND_DARK, borderColor: BRAND_DARK },
  fittingTextSel: { color: '#fff' },
  fittingDay: { fontSize: 9, color: '#bbb', fontWeight: '700' },
  fittingNum: { fontSize: 18, fontWeight: '300', color: BRAND_DARK, marginTop: 4 },
  notes: { backgroundColor: '#fff', padding: 15, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#eee', marginTop: 20, color: BRAND_DARK, fontSize: 13 },
  navBtns: { flexDirection: 'row', gap: 12, marginTop: 30 },
  backBtn: { paddingVertical: 16, paddingHorizontal: 25, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', alignItems: 'center' },
  backBtnText: { color: BRAND_DARK, fontWeight: '800', fontSize: 10, letterSpacing: 1 },
  primaryBtn: { flex: 1, backgroundColor: BRAND_DARK, padding: 16, alignItems: 'center', justifyContent: 'center' },
  primaryBtnDisabled: { opacity: 0.2 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 10, letterSpacing: 1.5 },
  confirmBtn: { backgroundColor: BRAND_GOLD },
  summaryCard: { backgroundColor: '#fff', padding: 25, borderWidth: 1, borderColor: '#eee' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  summaryLabel: { fontSize: 9, color: '#bbb', fontWeight: '800', letterSpacing: 1 },
  summaryVal: { fontSize: 12, color: BRAND_DARK, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
  totalLabel: { fontSize: 12, fontWeight: '900', color: BRAND_DARK, letterSpacing: 1 },
  totalVal: { fontSize: 18, fontWeight: '700', color: BRAND_GOLD }
});