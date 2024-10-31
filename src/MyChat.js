import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';
import './MyChat.css'; // CSS 파일을 따로 만들어서 스타일링
import { IoTimeOutline, IoChatbubbles, IoHomeOutline, IoPeopleOutline, IoPersonOutline } from 'react-icons/io5'; // 아이콘 사용

// 랜덤 동물 이모지 배열
const animalEmojis = [
    '🐶', '🐱', '🐰', '🐻', '🦊', '🦁', '🐼', '🐨', '🐷', '🐸', '🐢', '🐵'
];

const MyChat = () => {
    const [myChatRooms, setMyChatRooms] = useState([]); // 내 1:1 채팅
    const [createdChatRooms, setCreatedChatRooms] = useState([]); // 내가 만든 채팅
    const { responseUsername } = useContext(AppContext); // 닉네임 가져오기
    const navigate = useNavigate(); // navigation 객체 가져오기

    

    const fetchMyChatRooms = useCallback(() => {
        const data = {
            nickname: responseUsername,
        };

        axios.post('https://equal-duck-suitable.ngrok-free.app/main/private-rooms', data, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            }
        })
            .then(response => {
                setMyChatRooms(response.data); // 내 1:1 채팅 목록 업데이트
            })
            .catch(error => {
                console.error("내 채팅 목록 가져오기 오류:", error);
            });
    }, [responseUsername]); // responseUsername 변경될 때만 호출

    const fetchMyChatRoomsMadeByMe = useCallback(() => {
        const data = {
            nickname: responseUsername,
        };

        axios.post('https://equal-duck-suitable.ngrok-free.app/main/my-chatrooms', data, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            }
        })
            .then(response => {
                setCreatedChatRooms(response.data); // 내가 만든 채팅 목록 업데이트
            })
            .catch(error => {
                console.error("내가 만든 채팅 목록 가져오기 오류:", error);
            });
    }, [responseUsername]); // responseUsername 변경될 때만 호출
    useEffect(() => {
        fetchMyChatRooms();
        fetchMyChatRoomsMadeByMe();
    }, [fetchMyChatRooms,fetchMyChatRoomsMadeByMe]);
    const getRandomEmoji = () => {
        return animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
    };

    const handleChatSelect = (roomId, roomName) => {
        navigate(`/chatroom/${roomId}/${roomName}`); // 채팅방으로 이동
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
    const handleMyChat = () => {
        navigate('/mychat'); // 채팅 기록 페이지로 이동
    };
    const handleChatHistory = () => {
        navigate('/chathistory'); // 채팅 기록 페이지로 이동
    };

    return (
        <div className="my-chat">
            <header className="nav-bar">
                <h1>나의 1:1 채팅</h1>
            </header>

            {/* 내 1:1 채팅 섹션 */}
            <div className="chat-section">
                {myChatRooms.length > 0 ? (
                    <div className="chat-list">
                        {myChatRooms.map(item => (
                            <div key={item.id} className="chat-item" onClick={() => handleChatSelect(item.id, item.name)}>
                                <span className="chat-text">
                                    {getRandomEmoji()} {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>채팅이 없습니다.</p>
                )}
            </div>

            {/* 내가 만든 채팅 섹션 */}
            <div className="section-container">
                <h2 className="section-title">내가 만든 채팅</h2>
                {createdChatRooms.length > 0 ? (
                    <div className="chat-list">
                        {createdChatRooms.map(item => (
                            <div key={item.id} className="chat-item" onClick={() => handleChatSelect(item.id, item.name)}>
                                <span className="chat-text">
                                    {getRandomEmoji()} {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>만든 채팅이 없습니다.</p>
                )}
            </div>

            {/* 하단 네비게이션 바 추가 */}
            <div className="bottomNav">
                <div className="navItem" onClick={handleChatHistory}>
                    <IoTimeOutline size={30} color="#7BAFD4" />
                    <span>기록</span>
                </div>
                <div className="navItem" onClick={handleMyChat}>
                    <IoChatbubbles size={30} color="#7BAFD4" />
                    <span>내 채팅</span>
                </div>
                <div className="navItem" onClick={handleChatRoomList}>
                    <IoHomeOutline size={30} color="#7BAFD4" />
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
        </div>
    );
};

export default MyChat;
