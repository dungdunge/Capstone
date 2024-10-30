import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [loginToggle, setLoginToggle] = useState(false);
    const [responseUsername, setResponseUsername] = useState(null);
    const [chatlistTrue, setChatlistTrue] = useState([]); // 채팅방 목록 상태 추가

    return (
        <AppContext.Provider value={{ 
            loginToggle, 
            setLoginToggle, 
            responseUsername, 
            setResponseUsername, 
            chatlistTrue, 
            setChatlistTrue 
        }}>
            {children}
        </AppContext.Provider>
    );
};

// AppProvider를 기본 내보내기와 함께 내보내기
export { AppProvider };
export default AppContext;
