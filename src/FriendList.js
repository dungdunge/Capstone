import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';
import './FriendList.css'; // CSS 파일 임포트
import { IoTimeOutline, IoPeople, IoChatbubblesOutline, IoHomeOutline, IoPersonOutline } from 'react-icons/io5';

// 랜덤 동물 이모지 배열
const animalEmojis = [
    '🐶', '🐱', '🐰', '🐻', '🦊', '🦁', '🐼', '🐨', '🐷', '🐸', '🐢', '🐵'
];

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const { responseUsername } = useContext(AppContext);
    const navigate = useNavigate(); // navigate 훅 가져오기

    

    

    const fetchFriendsList = useCallback(() => {
        console.log('들어온유저네임 :',responseUsername);
        const data = {
            nickname: responseUsername,
        };
        axios.post('https://equal-duck-suitable.ngrok-free.app/bro/bro-list', data, {
            headers: {
                'ngrok-skip-browser-warning': '69420', // ngrok-skip-browser-warning 헤더 추가
            },
        })
            .then(response => {
                setFriends(response.data);
            })
            .catch(error => {
                console.error("친구 목록 가져오기 오류:", error);
            });
    }, [responseUsername]); // data가 변경될 때만 새로 생성

    const handleFriendPress = (friend) => {
        setSelectedFriend(friend.nickname);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedFriend(null);
    };

    const CreateChatWithFriend = () => {
        const chatData = {
            creatorNickname: responseUsername,
            otherUserNickname: selectedFriend,
        };

        axios.post('https://equal-duck-suitable.ngrok-free.app/main/create-private-room', chatData, {
            headers: {
                'ngrok-skip-browser-warning': '69420',
            },
        })
            .then(response => {
                navigate(`/chat-room/${response.data.id}`); // 채팅방으로 이동
                handleCloseModal();
            })
            .catch(error => {
                console.error("1:1 대화 시작 오류:", error);
            });
    };
    useEffect(() => {
        fetchFriendsList();
    }, [fetchFriendsList]);
    const renderFriendItem = (friend) => (
        <div className="friend-item" onClick={() => handleFriendPress(friend)}>
            <span className="friend-emoji">{getRandomEmoji()}</span>
            <span className="friend-text">{friend.nickname}</span>
        </div>
    );

    const getRandomEmoji = () => {
        return animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
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

    return (
        <div className="container">
            <div className="nav-bar">
                <h1 className="nav-title">친구 목록</h1>
            </div>

            <div className="friend-list">
                {friends.map(renderFriendItem)}
            </div>

            {modalVisible && (
                <div className="modal-view">
                    <h2 className="modal-title">{selectedFriend}</h2>
                    <button onClick={CreateChatWithFriend} className="chat-button">
                        1:1 대화하기
                    </button>
                    <button onClick={handleCloseModal} className="cancel-button">
                        취소
                    </button>
                </div>
            )}

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
                    <IoHomeOutline size={30} color="#7BAFD4" />
                    <span>메인</span>
                </div>
                <div className="navItem" onClick={handleFriendList}>
                    <IoPeople size={30} color="#7BAFD4" />
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

export default FriendsList;
