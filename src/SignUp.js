import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // CSS 파일을 따로 만들어서 스타일링

const SignUp = () => {
    const navigate = useNavigate();
    const [nickname, setNickName] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(false);
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [isPasswordMatch, setIsPasswordMatch] = useState(false);

    const navigateToLogIn = () => {
        navigate(-1);
    };

    const checkUsername = async () => {
        try {
            const response = await fetch(`https://equal-duck-suitable.ngrok-free.app/auth/check-username?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420', // ngrok 경고 무시
                },
            });
    
            if (!response.ok) {
                throw new Error('네트워크 응답 오류');
            }
            
            const data = await response.json();
            
            if (data.exists) {
                alert('이미 사용중인 아이디입니다.');
                setIsUsernameValid(false);
            } else {
                alert('사용 가능한 아이디입니다.');
                setIsUsernameValid(true);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('중복 확인 중 오류가 발생했습니다.');
        }
    };
    
    const checkNickname = async () => {
        try {
            const response = await fetch(`https://equal-duck-suitable.ngrok-free.app/auth/check-nickname?nickname=${nickname}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420', // ngrok 경고 무시
                },
            });
    
            if (!response.ok) {
                throw new Error('네트워크 응답 오류');
            }
            
            const data = await response.json();
            
            if (data.exists) {
                alert('이미 사용중인 별명입니다.');
                setIsNicknameValid(false);
            } else {
                alert('사용 가능한 별명입니다.');
                setIsNicknameValid(true);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('중복 확인 중 오류가 발생했습니다.');
        }
    };
    
    

    const handleConfirmPassword = (text) => {
        setConfirmPassword(text);
        setIsPasswordMatch(text === password);
    };

    const SignUp = () => {
        if (nickname && password && username && isNicknameValid && isUsernameValid && isPasswordMatch) {
            const userData = {
                nickname: nickname,
                username: username,
                password: password,
            };

            fetch('https://equal-duck-suitable.ngrok-free.app/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('회원가입 응답 데이터:', data);
                    alert('회원가입이 완료되었습니다.');
                    navigateToLogIn();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('회원가입에 실패했습니다.');
                });
        } else {
            alert('모든 필드를 입력하고 중복 확인을 해주세요.');
        }
    };

    const navigateBack = () => {
        navigate(-1);
    };

    return (
        <div className="signup-page">
            <h1 className="title">회원가입</h1>

            <div className="input-container">
                <input
                    className={`form-input ${isNicknameValid ? 'valid-input' : ''}`}
                    type="text"
                    placeholder="닉네임"
                    onChange={e => setNickName(e.target.value)}
                    value={nickname}
                />
                <button className="check-button" onClick={checkNickname}>중복 확인</button>
            </div>

            <div className="input-container">
                <input
                    className={`form-input ${isUsernameValid ? 'valid-input' : ''}`}
                    type="text"
                    placeholder="아이디"
                    onChange={e => setUserName(e.target.value)}
                    value={username}
                />
                <button className="check-button" onClick={checkUsername}>중복 확인</button>
            </div>

            <div className="input-container">
                <input
                    className="form-input"
                    type="password"
                    placeholder="비밀번호"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                />
            </div>

            <div className="input-container">
                <input
                    className={`form-input ${isPasswordMatch ? 'valid-input' : 'invalid-input'}`}
                    type="password"
                    placeholder="비밀번호 확인란"
                    onChange={e => handleConfirmPassword(e.target.value)}
                    value={confirmPassword}
                />
            </div>

            <div className="button-container">
                <button
                    className="form-button"
                    onClick={SignUp}
                    disabled={!(isNicknameValid && isUsernameValid && isPasswordMatch)}
                >
                    회원가입
                </button>
                <button className="form-button" onClick={navigateBack}>
                    뒤로가기
                </button>
            </div>
        </div>
    );
};

export default SignUp;
