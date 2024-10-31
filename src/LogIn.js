import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';
import './LogIn.css'; // CSS 파일을 따로 만들어서 스타일링

const LogIn = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const { responseUsername, setResponseUsername} = useContext(AppContext);
    const navigate = useNavigate();

    const navigateToSignUp = () => {
        navigate('/signup');
    };

    const navigateToChatRoomList = () => {
        navigate('/chatroomlist');
    };
    
    const LogIn_submit = () => {
        if (username && password) {
            const userData = {
                username: username,
                password: password,
            };

            fetch('https://equal-duck-suitable.ngrok-free.app/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420',
                },
                body: JSON.stringify(userData),
            })
                .then(response => {
                    if (!response.ok) {
                        console.log(response);
                        console.log('네트워크 응답 오류');
                        throw new Error('네트워크 응답이 올바르지 않습니다.');
                    }
                    return response.text(); // JSON 형식으로 응답을 파싱
                })
                .then(data => {
                    console.log('보내는 data :', JSON.stringify(userData));
                    alert('로그인이 완료되었습니다.');
                    
                    getNickname();

                    navigateToChatRoomList(); // 이동 호출
                })
                .catch(error => {
                    alert('로그인에 실패했습니다.');
                    console.log(error);
                });
        } else {
            alert('입력 오류: 모든 필드를 입력해주세요.');
        }
    };
    const getNickname = () => {//nickname 얻는 요청
        fetch('https://equal-duck-suitable.ngrok-free.app/auth/getNickname', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'ngrok-skip-browser-warning': '69420',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('닉네임 얻기 네트워크 오류.');
                }
                return response.json(); // JSON 형식으로 응답을 파싱
            })
            .then(data => {
                // 필요한 경우 상태 업데이트나 다른 작업 수행
                setResponseUsername(data.nickname);
                console.log('닉네임 설정 :',responseUsername);
            })
            .catch(error => {
                alert('오류', '닉네임을 가져오는 데 실패했습니다.');
            });
    };
    return (
        <div className="login-page">
            <h1 className="title">안녕하세요 :)</h1>
            <h2 className="subtitle">스몰톡입니다.</h2>
            <input
                className="form-input"
                type="text"
                placeholder="아이디 입력"
                onChange={e => setUserName(e.target.value)}
                value={username}
            />
            <input
                className="form-input"
                type="password"
                placeholder="비밀번호 입력"
                onChange={e => setPassword(e.target.value)}
                value={password}
            />
            <div className="footer">
                <button className="form-button" onClick={LogIn_submit}>
                    로그인
                </button>
                <button className="form-button" onClick={navigateToSignUp}>
                    회원가입
                </button>
            </div>
        </div>
    );
};

export default LogIn;
