import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
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
    // const [selectedFriend, setSelectedFriend] = useState(null);
    const { roomId, roomName } = useParams();
    const socketUrl = `wss://equal-duck-suitable.ngrok-free.app/ws`;
    const apiUrl = `https://equal-duck-suitable.ngrok-free.app/main/chat/${roomId}`;
    const { response_username } = useContext(AppContext);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null); // 메시지 끝 위치를 참조할 ref

    const handleGoBack = () => {
        navigate(-1);
    };

    const connect = useCallback(() => {
        if (!roomId) {
            console.error("Room ID가 정의되지 않았습니다.");
            return;
        }

        const socket = new WebSocket(socketUrl);
        stompClient.current = Stomp.over(() => socket);
        const headers = {
            nickname: response_username,
            roomId: roomId.toString(),
        };

        stompClient.current.connect(headers, () => {
            stompClient.current.subscribe(`/sub/chatroom/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }, (error) => {
            console.error("Connection error:", error);
        });
    }, [roomId, response_username, socketUrl]);

    const disconnect = useCallback(() => {
        if (stompClient.current) {
            stompClient.current.disconnect();
            stompClient.current = null; // 연결 해제 후 null로 설정
        }
    }, []);

    const sendMessage = () => {
        if (!inputValue.trim()) {
            console.error("메시지를 입력하세요.");
            return; // inputValue가 비어 있으면 함수 종료
        }

        if (stompClient.current) {
            const body = {
                roomId: roomId,
                name: response_username,
                message: inputValue,
                timestamp: new Date().toISOString(),
                type: "CHAT",
            };

            stompClient.current.send(`/pub/chat/${roomId}`, {}, JSON.stringify(body));
            setInputValue(''); // 전송 후 입력 필드 비우기
        } else {
            console.error("연결이 되어 있지 않습니다.");
        }
    };

    const fetchMessages = useCallback(() => {
        axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            }
        })
        .then(response => {
            if (Array.isArray(response.data)) {
                setMessages(response.data);
            } else {
                console.error("응답 데이터가 배열이 아닙니다:", response.data);
                setMessages([]);
            }
        })
        .catch(error => console.error("메시지 가져오기 오류:", error));
    }, [apiUrl]);

    // 메시지가 변경될 때마다 자동으로 스크롤
    useEffect(() => {
        fetchMessages();
        connect();
        return () => {
            disconnect();
        };
    }, [roomId, connect, disconnect, fetchMessages]);

    useEffect(() => {
        // 메시지가 변경될 때 가장 아래로 스크롤
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

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
                {/* 스크롤을 위한 빈 div */}
                <div ref={messagesEndRef} />
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
                    {/* <h3>{selectedFriend}</h3> */}
                    <button onClick={() => {/* 1:1 채팅 로직 */}}>1:1 채팅</button>
                    <button onClick={() => {/* 친구 추가 로직 */}}>친구 추가</button>
                    <button onClick={() => setModalVisible(false)}>닫기</button>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;
