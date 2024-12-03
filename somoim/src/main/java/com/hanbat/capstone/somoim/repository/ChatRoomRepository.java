//package com.hanbat.capstone.somoim.repository;
//
//import com.hanbat.capstone.somoim.domain.ChatRoom;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
//    List<ChatRoom> findByNameContaining(String name);
//}
package com.hanbat.capstone.somoim.repository;

import com.hanbat.capstone.somoim.domain.ChatRoom;
import com.hanbat.capstone.somoim.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByCategory(String category);
    // 두 닉네임을 기준으로 1:1 채팅방 찾기
    Optional<ChatRoom> findByCreatorNicknameAndOtherUserNickname(String creatorNickname, String otherUserNickname);

    // 반대로 검색하는 메서드 (creator와 otherUser의 역할이 바뀔 경우에도 대응)
    Optional<ChatRoom> findByOtherUserNicknameAndCreatorNickname(String otherUserNickname, String creatorNickname);

    //List<ChatRoom> findByCreatorNicknameOrOtherUserNicknameAndCategory(String creatorNickname, String otherUserNickname, String category);
    List<ChatRoom> findByCategoryNot(String aPrivate);
    List<ChatRoom> findByCreatorNicknameAndCategory(String creatorNickname, String category);
    List<ChatRoom> findByOtherUserNicknameAndCategory(String otherUserNickname, String category);

    List<ChatRoom> findByCreatorNickname(String creatorNickname);

}