package com.hanbat.capstone.somoim.web;

import com.hanbat.capstone.somoim.domain.ChatMessage;
import com.hanbat.capstone.somoim.domain.ChatRoom;
import com.hanbat.capstone.somoim.dto.*;
import com.hanbat.capstone.somoim.repository.ChatMessageRepository;
import com.hanbat.capstone.somoim.repository.ChatRoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/main")
@RequiredArgsConstructor
@Slf4j
public class ChatController {


    private final SimpMessageSendingOperations template;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;

    // 채팅방 생성
    @PostMapping("/create-room")
    public ResponseEntity<ChatRoom> createChatRoom(@RequestBody ChatRoomRequest request) {
        String creatorNickname = request.getCreatorNickname(); // 클라이언트로부터 받은 닉네임

        ChatRoom chatRoom = new ChatRoom(request.getName(), request.getCategory(), creatorNickname,null);
        ChatRoom savedRoom = chatRoomRepository.save(chatRoom);
        return ResponseEntity.ok(savedRoom);
    }
    // 채팅방 삭제
    @DeleteMapping("/delete-room")
    public ResponseEntity<String> deleteChatRoom(@RequestBody DeleteChatRoomRequest request) {
        Long roomId = request.getRoomId();
        String nickname = request.getNickname();

        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(roomId);

        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();
            // 생성자의 닉네임과 요청자의 닉네임 비교
            if (chatRoom.getCreatorNickname().equals(nickname)) {
                chatRoomRepository.delete(chatRoom);
                return ResponseEntity.ok("채팅방이 삭제되었습니다.");
            } else {
                return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
            }
        } else {
            return ResponseEntity.status(404).body("채팅방을 찾을 수 없습니다.");
        }
    }

    @GetMapping("/select-room")
    public ResponseEntity<List<ChatRoom>> getAllChatRooms() {

        List<ChatRoom> publicChatRooms = chatRoomRepository.findByCategoryNot("private");

        return ResponseEntity.ok(publicChatRooms);
    }


// 특정 채팅방의 메시지 리스트 반환
@GetMapping("/chat/{roomId}")
public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long roomId) {
    List<ChatMessage> messages = chatMessageRepository.findByRoomId(roomId);
    return ResponseEntity.ok().body(messages);
}

    //특정 카테고리 리스트 반환
    @GetMapping("/chatrooms/category/{category}")
    public ResponseEntity<List<ChatRoom>> getChatRoomsByCategory(@PathVariable String category) {
        List<ChatRoom> chatRooms = chatRoomRepository.findByCategory(category);
        return ResponseEntity.ok().body(chatRooms);
    }

    @MessageMapping("/chat/{roomId}")
    public void receiveMessage(@DestinationVariable Long roomId, @RequestBody ChatMessage chatMessage) {

        log.info("받은 메시지: roomId={}, sender={}, message={}, type={}",
                roomId, chatMessage.getName(), chatMessage.getMessage(), chatMessage.getType());
        // 채팅방 ID를 설정
        chatMessage.setRoomId(roomId);

        // 메시지를 DB에 저장
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

        // 저장된 메시지를 해당 채팅방 구독자들에게 전송
        String destination = "/sub/chatroom/" + roomId;

        log.info("메시지를 전송 중: roomId={}, destination={}", roomId, destination);

        template.convertAndSend(destination, savedMessage);

        log.info("메시지가 전송됨: roomId={}, destination={}", roomId, destination);

    }

    //사용자 채팅 참여 목록 반환
    @PostMapping("/history")
    public ResponseEntity<List<ChatRoom>> getChatRoomsForUser(@RequestBody NicknameDto userRequestDto) {
        String username = userRequestDto.getNickname();
        log.info("username = {}", username);
        // 사용자가 참여한 채팅방 ID 목록 조회
        List<Long> roomIds = chatMessageRepository.findDistinctRoomIdsByUsername(username);

        // 채팅방 ID 목록을 기반으로 채팅방 조회
        List<ChatRoom> chatRooms = chatRoomRepository.findAllById(roomIds);

        return ResponseEntity.ok(chatRooms);
    }

    // 1:1 채팅방 생성 또는 기존 방 조회
    @PostMapping("/create-private-room")
    public ResponseEntity<ChatRoom> createPrivateChatRoom(@RequestBody PrivateChatRoomRequest request) {
        String creatorNickname = request.getCreatorNickname();
        String otherUserNickname = request.getOtherUserNickname();

        // 기존 채팅방이 있는지 확인
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByCreatorNicknameAndOtherUserNickname(creatorNickname, otherUserNickname)
                .or(() -> chatRoomRepository.findByOtherUserNicknameAndCreatorNickname(creatorNickname, otherUserNickname));

        if (existingRoom.isPresent()) {
            // 기존 채팅방이 있다면 해당 방 반환
            return ResponseEntity.ok(existingRoom.get());
        }

        // 없으면 새로 생성
        String roomName = creatorNickname + "-" + otherUserNickname;  // 예: "user1-user2" 형식
        ChatRoom chatRoom = new ChatRoom(roomName, "private", creatorNickname, otherUserNickname);
        ChatRoom savedRoom = chatRoomRepository.save(chatRoom);

        return ResponseEntity.ok(savedRoom);
    }

    // 특정 1:1 채팅방 조회
    @PostMapping("/private-rooms")
    public ResponseEntity<List<ChatRoom>> getPrivateRoomsForUser(@RequestBody NicknameDto request) {
        String userNickname = request.getNickname();


        List<ChatRoom> roomsAsCreator = chatRoomRepository.findByCreatorNicknameAndCategory(userNickname, "private");
        List<ChatRoom> roomsAsOtherUser = chatRoomRepository.findByOtherUserNicknameAndCategory(userNickname, "private");


        List<ChatRoom> privateRooms = Stream.concat(roomsAsCreator.stream(), roomsAsOtherUser.stream())
                .collect(Collectors.toList());

        return ResponseEntity.ok(privateRooms);
    }


    @PostMapping("/my-chatrooms")
    public ResponseEntity<List<ChatRoom>> getMyChatRooms(@RequestBody NicknameDto requestDto) {
        String creatorNickname = requestDto.getNickname();
        List<ChatRoom> chatRooms = chatRoomRepository.findByCreatorNickname(creatorNickname);
        return ResponseEntity.ok(chatRooms);
    }

}


