import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 더미 데이터
const dummy_chatlist = [
    { id: 1, name: "테스트1번방" },
    { id: 2, name: "테스트2번방" },
    { id: 3, name: "테스트3번방" },
    { id: 4, name: "테스트4번방" },
];
const dummy_chat = [
    { id: 1, roomId: 1, name: "홍길동", message: "홍" },
    { id: 2, roomId: 1, name: "홍길동", message: "길" },
    { id: 3, roomId: 1, name: "괴물쥐", message: "흐에!" },
    { id: 4, roomId: 2, name: "에크논", message: "크림" },
    { id: 5, roomId: 2, name: "홈스타", message: "세정제" },
    { id: 6, roomId: 3, name: "마지막", message: "테스트" }
];
const categories = [
    { emoji: '⚾️', label: '야구' },
    { emoji: '⚽️', label: '축구' },
    { emoji: '🎳', label: '볼링' },
    { emoji: '🏓', label: '탁구' },
    { emoji: '🎮', label: '게임' },
    { emoji: '🆕', label: '기타' },
];

const ChatApp = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigation = useNavigation();

    const filteredChatlist = dummy_chatlist.filter(chat =>
        chat.name.includes(searchTerm)
    );

    const handleChatSelect = (roomId) => {
        navigation.navigate('Chat', { roomId, chatname: dummy_chatlist.name }); // Chat 페이지로 이동
    };

    return (
        <View style={styles.container}>
            {/* Nav Bar */}
            <View style={styles.navBar}>
                <Button title="뒤로가기" onPress={() => { }} />
                <Text style={styles.navTitle}>채팅방 목록</Text>
                <Button title="방 생성" onPress={() => { }} />
            </View>

            {/* Search Bar */}
            <TextInput
                style={styles.searchBar}
                placeholder="채팅방 이름 검색"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            {/* Category Bar */}
            <ScrollView horizontal style={styles.categoryBar}>
                {categories.map((category, index) => (
                    <View key={index} style={styles.categoryItem}>
                        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                        <Text>{category.label}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Chat List Bar */}
            <ScrollView contentContainerStyle={styles.chatList}>
                {filteredChatlist.map(chat => (
                    <TouchableOpacity key={chat.id} onPress={() => handleChatSelect(chat.id)}>
                        <View style={styles.chatItem}>
                            <Text style={styles.chatImage}>🗨️</Text>
                            <Text style={styles.chatName}>{chat.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    navTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchBar: {
        width: '100%',
        padding: 15,
        marginVertical: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
        fontSize: 16,
    },
    categoryBar: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    categoryItem: {
        alignItems: 'center',
        marginHorizontal: 15,
        paddingVertical: 5,
    },
    categoryEmoji: {
        fontSize: 30,
    },
    chatList: {
        paddingHorizontal: 0,
        paddingTop: 0,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    chatImage: {
        fontSize: 30,
        marginRight: 15,
    },
    chatName: {
        fontSize: 18,
    },
});

export default ChatApp;
