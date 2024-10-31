import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';
import './ChatRoomList.css'; // CSS 파일을 따로 만들어서 스타일링
import { useSwipeable } from 'react-swipeable'; // 스와이프 목록을 위한 패키지
import { IoTimeOutline, IoChatbubblesOutline, IoHome, IoPeopleOutline, IoPersonOutline } from 'react-icons/io5';

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
    const { responseUsername } = useContext(AppContext);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');

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
                'ngrok-skip-browser-warning': '69420',
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
        console.log('닉네임:', responseUsername);
        if (selectedCategory && roomName) {
            axios.post(createChatRoomUrl, {
                category: selectedCategory.label,
                name: roomName,
                creatorNickname: responseUsername,
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

    const handleDeleteRoom = (roomId) => {
        setSelectedRoomId(roomId);
        setDeleteModalVisible(true);
    };

    const confirmDeleteRoom = () => {
        axios.delete(deleteChatRoomUrl, {
            data: { roomId: selectedRoomId, nickname: responseUsername },
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
    const handleMyInfo = () => {
        navigate('/myinfo'); // 내 정보 페이지로 이동
    };

    const handleFriendList = () => {
        navigate('/friendlist'); // 친구 목록 페이지로 이동
    };
    const handleChatRoomList = () => {
        navigate('/chatroomlist'); // 메인 페이지로 이동
    };

    const handleChatHistory = () => {
        navigate('/chathistory'); // 채팅 기록 페이지로 이동
    };
    const handleMyChat = () => {
        navigate('/mychat'); // 내 채팅 페이지로 이동
    };
    const filteredChatlist = Array.isArray(chatlistTrue) ? chatlistTrue
        .filter(chat => chat.name.includes(searchTerm))
        .reverse() : [];

    return (
        <div className="chat-room-list">
            <header className="nav-bar">
                <h1>Chat</h1>
                <p>{responseUsername}</p>
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
                <button onClick={fetchChatList}>새로고침</button>
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
            {/* 하단 네비게이션 바 추가 */}
            <div className="bottomNav">
                <div className="navItem" onClick={handleChatHistory}>
                    <IoTimeOutline size={30} color="#7BAFD4" />
                    <span>기록</span>
                </div>
                <div className="navItem" onClick={handleMyChat}>
                    <IoChatbubblesOutline size={30} color="#7BAFD4" />
                    <span>내 채팅</span>
                </div>
                <div className="navItem" onClick={handleChatRoomList}>
                    <IoHome size={30} color="#7BAFD4" />
                    <span>메인</span>
                </div>
                <div className="navItem" onClick={handleFriendList}>
                    <IoPeopleOutline size={30} color="#7BAFD4" />
                    <span>친구</span>
                </div>
                <div className="navItem" onClick={handleMyInfo}>
                    <IoPersonOutline size={30} color="#7BAFD4" />
                    <span>내 정보</span>
                </div>
            </div>
            {modalVisible && (
                <div className="modal">
                    <div>
                        <h2>채팅방 생성</h2>

                        {/* 카테고리 선택 버튼 */}
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

                        {/* 방 이름 입력 필드 */}
                        <input
                            type="text"
                            placeholder="채팅방 이름"
                            value={roomName}
                            onChange={e => setRoomName(e.target.value)}
                        />

                        {/* 생성 및 취소 버튼 */}
                        <div className="modal-button-container">
                            <button onClick={handleCreateRoom}>생성</button>
                            <button onClick={() => setModalVisible(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}



            {deleteModalVisible && (
                <div className="modal">
                    <div>
                        <h2 style={{ fontSize: '2vh' }}>채팅방을 삭제하시겠습니까?</h2>
                        <div className="modal-button-container">
                            <button style={{ fontSize: '1.3vh' }} onClick={confirmDeleteRoom}>예</button>
                            <button style={{ fontSize: '1.3vh' }} onClick={() => setDeleteModalVisible(false)}>아니오</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChatRoomList;
