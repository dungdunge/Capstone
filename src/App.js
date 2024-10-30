import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext'; // AppProvider를 가져옵니다.
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<ChatRoomList />} />
            <Route path="/chatroom/:roomId/:roomName" element={<ChatRoom />} />
            {/* 다른 경로 추가 가능 */}
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
