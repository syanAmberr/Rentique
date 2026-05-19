import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_GOLD = '#C5A373';
const BRAND_DARK = '#1A1110';

export default function AvailabilityCalendar({ onRangeSelect }) {
  // Hardcoded to April 2026 to match your design reference
  const [currentDate] = useState(new Date(2026, 3, 1)); 
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  // Mock Booked Dates (to simulate availability)
  const bookedDates = [15, 16, 22];

  const handleDatePress = (day) => {
    const selectedDate = new Date(2026, 3, day);
    
    // Logic: If no start exists, or if both exist (reset), set as start.
    if (!start || (start && end)) {
      setStart(selectedDate);
      setEnd(null);
      onRangeSelect(selectedDate, null);
    } 
    // Logic: If start exists but end doesn't, and selected is after start, set as end.
    else if (selectedDate > start) {
      setEnd(selectedDate);
      onRangeSelect(start, selectedDate);
    } 
    // Logic: If user clicks a date before the current start, reset start to that date.
    else {
      setStart(selectedDate);
      setEnd(null);
      onRangeSelect(selectedDate, null);
    }
  };

  const renderDays = () => {
    const days = [];
    const totalDays = 30; // April
    const startDayOffset = 3; // April 1, 2026 starts on a Wednesday

    // Padding for empty start-of-month slots
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<View key={`empty-${i}`} style={s.dayBox} />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const thisDate = new Date(2026, 3, d);
      const isBooked = bookedDates.includes(d);
      
      // Selection Styling Logic
      const isStart = start && thisDate.getTime() === start.getTime();
      const isEnd = end && thisDate.getTime() === end.getTime();
      const inRange = start && end && thisDate > start && thisDate < end;

      days.push(
        <TouchableOpacity 
          key={d} 
          disabled={isBooked}
          onPress={() => handleDatePress(d)}
          style={[
            s.dayBox, 
            inRange && s.rangeBox,
            isStart && s.startBox,
            isEnd && s.endBox
          ]}
        >
          <Text style={[
            s.dayText, 
            isBooked && s.bookedText,
            (isStart || isEnd) && s.edgeText,
            inRange && s.rangeText
          ]}>
            {d}
          </Text>
          {isBooked && <View style={s.bookedDot} />}
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <View style={s.container}>
      <View style={s.monthHeader}>
        <Ionicons name="chevron-back" size={16} color="#CCC" />
        <Text style={s.monthTitle}>APRIL 2026</Text>
        <Ionicons name="chevron-forward" size={16} color={BRAND_DARK} />
      </View>

      <View style={s.weekRow}>
        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(w => (
          <Text key={w} style={s.weekText}>{w}</Text>
        ))}
      </View>

      <View style={s.daysGrid}>
        {renderDays()}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { padding: 10 },
  monthHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20
  },
  monthTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, color: BRAND_DARK },
  
  weekRow: { flexDirection: 'row', marginBottom: 10 },
  weekText: { flex: 1, textAlign: 'center', fontSize: 9, fontWeight: '800', color: '#BBB' },
  
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayBox: { 
    width: `${100 / 7}%`, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginVertical: 2
  },
  dayText: { fontSize: 12, fontWeight: '600', color: BRAND_DARK },
  
  // Selected Styles
  startBox: { backgroundColor: BRAND_GOLD, borderRadius: 4 },
  endBox: { backgroundColor: BRAND_GOLD, borderRadius: 4 },
  rangeBox: { backgroundColor: '#F9F5F1' }, // Subtle highlight for dates in between
  
  edgeText: { color: '#FFF', fontWeight: '800' },
  rangeText: { color: BRAND_GOLD },

  // Booked Styles
  bookedText: { color: '#EEE' },
  bookedDot: { 
    width: 3, height: 3, borderRadius: 1.5, 
    backgroundColor: '#F44336', position: 'absolute', bottom: 5 
  }
});