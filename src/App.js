import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext'; // AppProvider를 가져옵니다.
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';
import LogIn from './LogIn';
import SignUp from './SignUp';
import ChatHistory from './ChatHistory';
import MyChat from './MyChat';
import MyInfo from './MyInfo';
import FriendsList from './FriendList';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/chathistory" element={<ChatHistory/>}/>
            <Route path="/mychat" element={<MyChat/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/myinfo" element={<MyInfo/>}/>
            <Route path="/friendlist" element={<FriendsList/>}/>
            <Route path="/chatroomlist" element={<ChatRoomList />} />
            <Route path="/chatroom/:roomId/:roomName" element={<ChatRoom />} />
            {/* 다른 경로 추가 가능 */}
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
