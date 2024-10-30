import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import AppContext from './AppContext';
import './ChatRoom.css'; // CSS 파일을 따로 만들어서 스타일링
import { Stomp } from "@stomp/stompjs";
import { IoArrowBack } from "react-icons/io5"; // 아이콘 사용

const ChatRoom = () => {
    const stompClient = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const { roomId, roomName } = useParams();
    const socketUrl = `wss://equal-duck-suitable.ngrok-free.app/ws`;
    const apiUrl = `https://equal-duck-suitable.ngrok-free.app/main/chat/${roomId}`; // 환경 변수로 변경 가능
    const { response_username } = useContext(AppContext);
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false);

    console.log('ChatRoom에서 roomId:', roomId);

    const handleGoBack = () => {
        navigate(-1);
    };

    const connect = () => {
        if (!roomId) {
            console.error("Room ID가 정의되지 않았습니다.");
            return; // roomId가 없으면 연결하지 않음
        }

        const socket = new WebSocket(socketUrl);
        stompClient.current = Stomp.over(() => socket);
        const headers = {
            nickname: response_username,
            roomId: roomId.toString(),
        };

        stompClient.current.connect(headers, () => {
            setIsConnected(true);


            stompClient.current.subscribe(`/sub/chatroom/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, newMessage];
                    return updatedMessages;
                });
            });
        }, (error) => {
            console.error("Connection error:", error);
            setIsConnected(false);
        });
    };

    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.disconnect();
            stompClient.current = null; // 연결 해제 후 null로 설정
        }
    };

    const sendMessage = () => {
        if (stompClient.current && inputValue) {
            const body = {
                roomId: roomId,
                name: response_username,
                message: inputValue,
                timestamp: new Date().toISOString(),
                type: "CHAT",
            };

            stompClient.current.send(`/pub/chat/${roomId}`, {}, JSON.stringify(body));
            setInputValue('');
        } else {
            console.error("메시지를 입력하세요.");
        }
    };

    const openModal = (friendName) => {
        setSelectedFriend(friendName);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedFriend(null);
    };

    const fetchMessages = () => {
        axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            }
        })
        .then(response => {
            // 응답이 배열인지 확인
            if (Array.isArray(response.data)) {
                setMessages(response.data);
            } else {
                console.error("응답 데이터가 배열이 아닙니다:", response.data);
                setMessages([]); // 기본값으로 빈 배열 설정
            }
        })
        .catch(error => console.error("메시지 가져오기 오류:", error));
    };
    
    

    useEffect(() => {
        fetchMessages();
        if (!isConnected) {
            connect();
        }
        // 의존성 배열에서 connect와 fetchMessages를 제거
        return () => {
            disconnect();
        };
    }, [roomId, isConnected]);
    
    

    return (
        <div className="chat-room-container">
            <div className="navBar">
                <button onClick={handleGoBack}>
                    <IoArrowBack size={24} />
                </button>
                <h2>{roomName}</h2>
            </div>

            <div className="messages">
                {messages.map((item, index) => (
                    <div key={index} className={item.name === response_username ? "myMessage" : "otherMessage"}>
                        <p>{item.name}: {item.message}</p>
                        <small>{new Date(item.timestamp).toLocaleTimeString()}</small>
                    </div>
                ))}
            </div>

            <div className="inputContainer">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="메시지를 입력하세요"
                />
                <button onClick={sendMessage}>전송</button>
            </div>

            {modalVisible && (
                <div className="modal">
                    <h3>{selectedFriend}</h3>
                    <button onClick={() => {/* 1:1 채팅 로직 */}}>1:1 채팅</button>
                    <button onClick={() => {/* 친구 추가 로직 */}}>친구 추가</button>
                    <button onClick={handleCloseModal}>닫기</button>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;
