import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';
import './ChatRoomList.css'; // CSS 파일을 따로 만들어서 스타일링
import { useSwipeable } from 'react-swipeable'; // 스와이프 목록을 위한 패키지

const categories = [
    { emoji: '🏅', label: '스포츠' },
    { emoji: '🎮', label: '게임' },
    { emoji: '📚', label: '스터디' },
    { emoji: '🍔', label: '음식' },
    { emoji: '🥼', label: '패션' },
    { emoji: '💄', label: '뷰티' },
    { emoji: '🆕', label: '기타' }
];

const baseCategoryUrl = "https://equal-duck-suitable.ngrok-free.app/main/chatrooms/category";
const createChatRoomUrl = "https://equal-duck-suitable.ngrok-free.app/main/create-room";
const chatlistgetUrl = "https://equal-duck-suitable.ngrok-free.app/main/select-room";
const deleteChatRoomUrl = "https://equal-duck-suitable.ngrok-free.app/main/delete-room";

const SwipeableChatItem = ({ item, onChatSelect, onDeleteRoom }) => {
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => onDeleteRoom(item.id, item.name),
        onSwipedRight: () => onChatSelect(item.id, item.name), // 채팅방 선택
    });

    return (
        <div {...swipeHandlers} className="chat-item" onClick={() => onChatSelect(item.id, item.name)}>
            <span>{item.name}</span>
        </div>
    );
};


const ChatRoomList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(categories[1]);
    const [roomName, setRoomName] = useState('');
    const { chatlistTrue, setChatlistTrue } = useContext(AppContext);
    const navigate = useNavigate();
    const { response_username } = useContext(AppContext);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [selectedRoomName, setSelectedRoomName] = useState('');

    const fetchChatList = useCallback(() => {
        axios.get(chatlistgetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            }
        })
            .then(response => {
                console.log(response);
                console.log("채팅방 목록 응답:", response.data); // 응답 데이터 로그 추가
                setChatlistTrue(response.data);
            })
            .catch(error => console.error("채팅방 목록 가져오기 오류:", error));
    }, [setChatlistTrue]);

    const fetchChatListByCategory = (category) => {
        axios.get(`${baseCategoryUrl}/${category}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                setChatlistTrue(response.data);
            })
            .catch(error => console.error(`${category} 카테고리 채팅방 목록 가져오기 오류:`, error));
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsDropdownVisible(false);
    };

    const handleCreateRoom = () => {
        if (selectedCategory && roomName) {
            axios.post(createChatRoomUrl, {
                category: selectedCategory.label,
                name: roomName,
                creatorNickname: response_username,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(() => {
                    setModalVisible(false);
                    setRoomName('');
                    setSelectedCategory(categories[1]);
                    fetchChatList();
                })
                .catch(error => console.error("채팅방 생성 오류:", error));
        } else {
            alert("카테고리와 방 이름을 선택해야 합니다.");
        }
    };

    const handleDeleteRoom = (roomId, roomName) => {
        setSelectedRoomId(roomId);
        setSelectedRoomName(roomName);
        setDeleteModalVisible(true);
    };

    const confirmDeleteRoom = () => {
        axios.delete(deleteChatRoomUrl, {
            data: { roomId: selectedRoomId, nickname: response_username },
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(() => {
                fetchChatList();
                setDeleteModalVisible(false);
            })
            .catch(error => console.error("채팅방 삭제 오류:", error));
    };

    useEffect(() => {
        fetchChatList();
    }, [fetchChatList]);

    const handleChatSelect = (roomId, roomName) => {
        navigate(`/chatroom/${roomId}/${roomName}`, { state: { roomId, roomName } });
    };

    const filteredChatlist = Array.isArray(chatlistTrue) ? chatlistTrue
        .filter(chat => chat.name.includes(searchTerm))
        .reverse() : [];

    return (
        <div className="chat-room-list">
            <header className="nav-bar">
                <h1>Chat</h1>
                <p>{response_username}</p>
                <button onClick={() => setModalVisible(true)}>방 생성</button>
            </header>

            <input
                type="text"
                placeholder="채팅방 이름 검색"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            <div className="category-container">
                {categories.map((category, index) => (
                    <button key={index} onClick={() => fetchChatListByCategory(category.label)}>
                        {category.emoji} {category.label}
                    </button>
                ))}
                <button onClick={fetchChatList}>새로 고침</button>
            </div>

            <div className="chat-list">
                {filteredChatlist.map((item) => (
                    <SwipeableChatItem
                        key={item.id}
                        item={item}
                        onChatSelect={handleChatSelect}
                        onDeleteRoom={handleDeleteRoom}
                    />
                ))}
            </div>

            {modalVisible && (
                <div className="modal">
                    <h2>채팅방 생성</h2>
                    <button onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
                        {selectedCategory.emoji} {selectedCategory.label}
                    </button>
                    {isDropdownVisible && (
                        <div className="dropdown-list">
                            {categories.map((category) => (
                                <button key={category.label} onClick={() => handleCategorySelect(category)}>
                                    {category.emoji} {category.label}
                                </button>
                            ))}
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="채팅방 이름"
                        value={roomName}
                        onChange={e => setRoomName(e.target.value)}
                    />
                    <button onClick={handleCreateRoom}>생성</button>
                    <button onClick={() => setModalVisible(false)}>취소</button>
                </div>
            )}

            {deleteModalVisible && (
                <div className="modal">
                    <h2>채팅방을 삭제하시겠습니까?</h2>
                    <button onClick={confirmDeleteRoom}>예</button>
                    <button onClick={() => setDeleteModalVisible(false)}>아니오</button>
                </div>
            )}
        </div>
    );
};

export default ChatRoomList;
