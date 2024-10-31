import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';
import './ChatHistory.css'; // CSS 파일을 따로 만들어서 스타일링
import { IoTime, IoChatbubblesOutline, IoHomeOutline, IoPeopleOutline, IoPersonOutline } from 'react-icons/io5'; // 아이콘 사용

const animalEmojis = [
    '🐶', '🐱', '🐰', '🐻', '🦊', '🦁', '🐼', '🐨', '🐷', '🐸', '🐢', '🐵'
];

const ChatHistory = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const { responseUsername } = useContext(AppContext); // 닉네임 가져오기
    const navigate = useNavigate(); // navigation 객체 가져오기

    const fetchChatHistory = useCallback(() => {
        const data = {
            nickname: responseUsername,
        };
        axios.post('https://equal-duck-suitable.ngrok-free.app/main/history', data, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            }
        })
            .then(response => {
                console.log(response.data);
                setChatRooms(response.data); // 채팅 기록 업데이트
            })
            .catch(error => {
                console.error("채팅 기록 가져오기 오류:", error);
            });
    }, [responseUsername]); // data가 변경될 경우에만 함수가 새로 생성됨
    useEffect(() => {
        fetchChatHistory();
    }, [fetchChatHistory]);
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
        navigate('/mychat'); // 내 채팅 페이지로 이동
    };

    const handleChatHistory = () => {
        navigate('/chathistory'); // 채팅 기록 페이지로 이동
    };
    return (
        <div className="chat-history">
            <header className="nav-bar">
                <h1>채팅 기록</h1>
            </header>

            <div className="chat-list">
                {chatRooms.map(item => (
                    <div key={item.id} className="chat-item" onClick={() => handleChatSelect(item.id, item.name)}>
                        <span className="chat-text">
                            {getRandomEmoji()} {item.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* 하단 네비게이션 바 추가 */}
            <div className="bottomNav">
                <div className="navItem" onClick={handleChatHistory}>
                    <IoTime size={30} color="#7BAFD4" />
                    <span>기록</span>
                </div>
                <div className="navItem" onClick={handleMyChat}>
                    <IoChatbubblesOutline size={30} color="#7BAFD4" />
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

export default ChatHistory;
