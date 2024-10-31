import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';
import './MyInfo.css'; // CSS 파일을 따로 만들어서 스타일링
import { IoTimeOutline, IoChatbubblesOutline, IoHomeOutline, IoPeopleOutline, IoPeople, IoPerson, IoPersonAdd } from 'react-icons/io5'; // 아이콘 사용

// 랜덤 동물 이모지 배열
const animalEmojis = [
    '🐶', '🐱', '🐰', '🐻', '🦊', '🦁', '🐼', '🐨', '🐷', '🐸', '🐢', '🐵'
];

const MyInfo = () => {
    const { responseUsername, setResponseUsername } = useContext(AppContext); // 닉네임 가져오기
    const navigate = useNavigate();

    // 모달 관련 상태
    const [modalVisible, setModalVisible] = useState(false);
    const [friendNickname, setFriendNickname] = useState('');
    const [requestModalVisible, setRequestModalVisible] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);

    // 랜덤 동물 이모지 선택
    const randomAnimalEmoji = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];

    const handleLogout = () => {
        // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem('authToken'); // 로컬 스토리지에서 토큰 제거
        setResponseUsername(null); // AppContext에서 닉네임 초기화
        alert("로그아웃 성공");
        navigate('/'); // 로그인 페이지로 이동
    };
    
    

    const handleAddFriend = () => {
        if (!friendNickname) {
            alert("친구 닉네임을 입력하세요.");
            return;
        }

        const data = {
            senderNickname: responseUsername,
            receiverNickname: friendNickname,
        };

        axios.post('https://equal-duck-suitable.ngrok-free.app/bro/request', data, {
            headers: {
                'ngrok-skip-browser-warning': '69420',
            },
        })
            .then(response => {
                alert("친구 요청이 전송되었습니다.");
                setModalVisible(false);
                setFriendNickname('');
            })
            .catch(error => {
                console.error("친구 요청 오류:", error);
                alert("친구 요청에 실패했습니다.");
            });
    };

    const fetchFriendRequests = () => {
        axios.get('https://equal-duck-suitable.ngrok-free.app/bro/request-list', {
            headers: {
                'ngrok-skip-browser-warning': '69420',
            },
        })
            .then(response => {
                setFriendRequests(response.data); // 친구 요청 목록 업데이트
            })
            .catch(error => {
                console.error("친구 요청 목록 가져오기 오류:", error);
            });
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
    const handleAcceptRequest = (requestId) => {
        const data = { requestId };

        axios.post('https://equal-duck-suitable.ngrok-free.app/bro/request-accept', data, {
            headers: {
                'ngrok-skip-browser-warning': '69420',
            },
        })
            .then(response => {
                alert("친구 요청이 수락되었습니다.");
                fetchFriendRequests(); // 목록 갱신
            })
            .catch(error => {
                console.error("친구 요청 수락 오류:", error);
                alert("친구 요청 수락에 실패했습니다.");
            });
    };

    return (
        <div className="my-info">
            <header className="nav-bar">
                <h1>내 정보</h1>
            </header>

            <div className="nickname-container">
                <span className="nickname-emoji">{randomAnimalEmoji}</span>
                <span className="nickname">{responseUsername}</span>
            </div>

            <div className="button-container">
                <div className="button-row">
                    <button className="action-button" onClick={() => setModalVisible(true)}>
                        <IoPersonAdd size={24} color="#007AFF" />
                        <span style={{ marginLeft: '8px' }}>친구 추가</span>
                    </button>
                    <button className="action-button" onClick={() => {
                        fetchFriendRequests();
                        setRequestModalVisible(true);
                    }}>
                        <IoPeople size={24} color="#007AFF" />
                        <span style={{ marginLeft: '4px' }}>받은 친구 요청</span>
                    </button>
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                    <button className="action-button" style={{ width: 'calc(47%)' }} onClick={handleLogout}>
                        <IoPersonAdd size={24} color="#FF3B30" />
                        <span style={{ marginLeft: '8px' }}>로그아웃</span>
                    </button>
                </div>
            </div>






            {/* 친구 추가 모달 */}
            {modalVisible && (
                <div className="modal">
                    <div>
                        <h2>친구 추가</h2>
                        <input
                            type="text"
                            placeholder="친구 닉네임"
                            value={friendNickname}
                            onChange={(e) => setFriendNickname(e.target.value)}
                        />
                        <div className="modal-button-container">
                            <button onClick={handleAddFriend}>요청</button>
                            <button onClick={() => setModalVisible(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}


            {/* 친구 요청 목록 모달 */}
            {requestModalVisible && (
                <div className="modal">
                    <div>
                        <h2>받은 친구 요청</h2>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {friendRequests.map(item => (
                                <li key={item.requestId} className="request-item">
                                    {item.senderNickname}
                                    <button onClick={() => handleAcceptRequest(item.requestId)}>수락</button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setRequestModalVisible(false)}>닫기</button>
                    </div>
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
                    <IoPeopleOutline size={30} color="#7BAFD4" />
                    <span>친구</span>
                </div>
                <div className="navItem" onClick={handleMyInfo}>
                    <IoPerson size={30} color="#7BAFD4" />
                    <span>내 정보</span>
                </div>

            </div>
        </div>
    );
};

export default MyInfo;
