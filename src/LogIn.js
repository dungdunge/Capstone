import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from './AppContext';
import './LogIn.css'; // CSS 파일을 따로 만들어서 스타일링

const LogIn = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const { setResponseUsername } = useContext(AppContext);
    const navigate = useNavigate();

    const navigateToSignUp = () => {
        navigate('/signup');
    };

    const navigateToChatRoomList = () => {
        navigate('/chatroomlist');
    };
    
    const LogIn_submit = (event) => {
        event.preventDefault(); // 기본 폼 제출 방지

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
                        return response.json().then(err => {
                            throw new Error(err.message || '로그인 실패');
                        });
                    }
                    return response.json(); // JSON 형식으로 응답을 파싱
                })
                .then(data => {
                    console.log('보내는 data :', JSON.stringify(userData));
                    alert('로그인이 완료되었습니다.');

                    // 서버에서 반환된 토큰을 localStorage에 저장
                    localStorage.setItem('authToken', data.token); // 토큰 저장

                    // 닉네임을 가져오는 함수 호출
                    getNickname();

                    navigateToChatRoomList(); // 이동 호출
                })
                .catch(error => {
                    alert('로그인에 실패했습니다: ' + error.message);
                    console.log(error);
                });
        } else {
            alert('입력 오류: 모든 필드를 입력해주세요.');
        }
    };

    const getNickname = () => { // 닉네임 얻는 요청
        const token = localStorage.getItem('authToken'); // 저장된 토큰을 가져옴
        fetch('https://equal-duck-suitable.ngrok-free.app/auth/getNickname', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
                'Authorization': `Bearer ${token}`, // 토큰을 헤더에 추가
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('닉네임 얻기 네트워크 오류.');
                }
                return response.text(); // JSON 형식으로 응답을 파싱
            })
            .then(data => {
                console.log('응답 데이터:', data); // 어떤 데이터가 반환되는지 확인
                try {
                    const jsonData = JSON.parse(data); // 수동으로 JSON 파싱 시도
                    setResponseUsername(jsonData.nickname);
                } catch (error) {
                    console.error('JSON 파싱 오류:', error);
                }
            })
            .catch(error => {
                alert('오류: 닉네임을 가져오는 데 실패했습니다.');
                console.log(error);
            });
    };

    return (
        <div className="login-page">
            <h1 className="title">안녕하세요 :)</h1>
            <h2 className="subtitle">스몰톡입니다.</h2>
            <form onSubmit={LogIn_submit}> {/* 폼 요소 추가 */}
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
                    <button className="form-button" type="submit"> {/* type="submit" 추가 */}
                        로그인
                    </button>
                    <button className="form-button" type="button" onClick={navigateToSignUp}> {/* type="button" 추가 */}
                        회원가입
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LogIn;
