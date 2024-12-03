package com.hanbat.capstone.somoim.repository;

import com.hanbat.capstone.somoim.domain.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.stream.Collectors;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRoomId(Long roomId);
    List<Long> findDistinctRoomIdByName(String name);

    // 특정 사용자가 보낸 메시지를 조회한 후, roomId를 추출
    default List<Long> findDistinctRoomIdsByUsername(String username) {
        List<ChatMessage> messages = findByName(username);
        return messages.stream()
                .map(ChatMessage::getRoomId)  // roomId 필드만 추출
                .distinct()  // 중복 제거
                .collect(Collectors.toList());
    }

    // 사용자의 이름으로 메시지 조회
    List<ChatMessage> findByName(String name);
}
