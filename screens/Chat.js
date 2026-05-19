import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, 
  KeyboardAvoidingView, Platform, TouchableOpacity, Image, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_GOLD = '#C5A373';
const BRAND_DARK = '#1A1110';
const BRAND_BG   = '#F9F5F1';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      text: "Welcome to Rentique Atelier. I am Elena, your personal stylist. How may I assist you with your selection today?", 
      sender: 'seller',
      time: '9:00 AM'
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef();

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMsg = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    // Simulate Seller Response
    setIsTyping(true);
    setTimeout(() => {
      const sellerMsg = {
        id: (Date.now() + 1).toString(),
        text: "That sounds wonderful. I'll check our collection's availability for those dates immediately. Would you like to schedule a fitting session as well?",
        sender: 'seller',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, sellerMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      s.messageWrapper, 
      item.sender === 'user' ? s.userWrapper : s.sellerWrapper
    ]}>
      {item.sender === 'seller' && (
        <View style={s.avatar}>
          <Text style={s.avatarText}>R</Text>
        </View>
      )}
      <View style={[
        s.bubble, 
        item.sender === 'user' ? s.userBubble : s.sellerBubble
      ]}>
        <Text style={[
          s.messageText, 
          item.sender === 'user' ? s.userText : s.sellerText
        ]}>
          {item.text}
        </Text>
        <Text style={s.timeText}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* ATELIER HEADER */}
      <View style={s.header}>
        <View style={s.statusDot} />
        <View>
          <Text style={s.headerTitle}>RENTIQUE CONCIERGE</Text>
          <Text style={s.headerSub}>Elena is currently online</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={s.listContent}
          onContentSizeChange={() => flatListRef.current.scrollToEnd()}
        />

        {isTyping && (
          <Text style={s.typingIndicator}>Elena is typing...</Text>
        )}

        {/* INPUT AREA */}
        <View style={s.inputContainer}>
          <TextInput
            style={s.input}
            placeholder="Inquire about a gown..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity onPress={handleSend} style={s.sendBtn}>
            <Ionicons name="send" size={20} color={BRAND_GOLD} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND_BG },
  header: {
    paddingTop: 60, paddingBottom: 20, paddingHorizontal: 25,
    backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee',
    flexDirection: 'row', alignItems: 'center'
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', marginRight: 12 },
  headerTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: BRAND_DARK },
  headerSub: { fontSize: 10, color: '#999', marginTop: 2 },

  listContent: { padding: 20, paddingBottom: 40 },
  messageWrapper: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-end' },
  userWrapper: { justifyContent: 'flex-end' },
  sellerWrapper: { justifyContent: 'flex-start' },

  avatar: { 
    width: 30, height: 30, borderRadius: 15, backgroundColor: BRAND_DARK, 
    justifyContent: 'center', alignItems: 'center', marginRight: 10 
  },
  avatarText: { color: BRAND_GOLD, fontSize: 12, fontWeight: '800' },

  bubble: { maxWidth: '80%', padding: 15, borderRadius: 20 },
  userBubble: { backgroundColor: BRAND_DARK, borderBottomRightRadius: 2 },
  sellerBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#eee' },

  messageText: { fontSize: 14, lineHeight: 20 },
  userText: { color: '#fff' },
  sellerText: { color: BRAND_DARK },
  timeText: { fontSize: 8, color: '#aaa', marginTop: 5, textAlign: 'right', fontWeight: '600' },

  typingIndicator: { fontSize: 10, color: BRAND_GOLD, marginLeft: 65, marginBottom: 10, fontStyle: 'italic' },

  inputContainer: {
    flexDirection: 'row', padding: 15, backgroundColor: '#fff',
    borderTopWidth: 1, borderColor: '#eee', alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 15
  },
  input: {
    flex: 1, height: 45, backgroundColor: '#F5F5F5', borderRadius: 25,
    paddingHorizontal: 20, fontSize: 14, color: BRAND_DARK
  },
  sendBtn: { marginLeft: 15, width: 45, height: 45, justifyContent: 'center', alignItems: 'center' }
});