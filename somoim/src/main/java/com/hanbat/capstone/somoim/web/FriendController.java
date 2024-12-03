
package com.hanbat.capstone.somoim.web;

import com.hanbat.capstone.somoim.dto.*;
import com.hanbat.capstone.somoim.domain.User;
import com.hanbat.capstone.somoim.service.FriendService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hanbat.capstone.somoim.jwt.JwtUtil;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/bro")
public class FriendController {

    private final FriendService friendService;

    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }


    @PostMapping("/request")
    public ResponseEntity<?> sendFriendRequest(@RequestHeader("Authorization") String token, @RequestBody FriendRequestDto friendRequestDto) {
        String senderUsername = JwtUtil.extractUsername(token.replace("Bearer ", ""));
        friendService.sendFriendRequest(friendRequestDto.getSenderNickname(), friendRequestDto.getReceiverNickname());
        return ResponseEntity.ok("친구 요청을 보냈습니다.");
    }


    @GetMapping("/request-list")
    public ResponseEntity<List<FriendRequestResponseDto>> getFriendRequests(@RequestHeader("Authorization") String token) {
        String username = JwtUtil.extractUsername(token.replace("Bearer ", ""));
        String currentUserNickname = friendService.getNicknameByUsername(username); // username을 이용해 nickname 조회

        List<FriendRequestResponseDto> friendRequests = friendService.getFriendRequestDtosByNickname(currentUserNickname);
        return ResponseEntity.ok(friendRequests);
    }

    // 친구 요청 수락
    @PostMapping("/request-accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestBody AcceptFriendRequestDto acceptRequestDto) {
        // JSON 형식으로 전달된 requestId를 사용
        friendService.acceptFriendRequest(acceptRequestDto.getRequestId());
        return ResponseEntity.ok("친구 요청을 수락했습니다.");
    }

    // 친구 목록 조회
    @PostMapping("/bro-list")
    public ResponseEntity<List<FlistDto>> getFriends(@RequestBody NicknameDto nicknameDto) {
        List<User> friends = friendService.getFriends(nicknameDto.getNickname());

        // User 객체를 UserDto로 변환
        List<FlistDto> friendsDto = friends.stream()
                .map(friend -> new FlistDto(friend.getId(), friend.getUsername(), friend.getNickname()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(friendsDto);
    }
}

