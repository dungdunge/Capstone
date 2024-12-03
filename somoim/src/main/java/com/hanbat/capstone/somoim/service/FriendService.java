package com.hanbat.capstone.somoim.service;

import com.hanbat.capstone.somoim.domain.User;
import com.hanbat.capstone.somoim.dto.FriendRequest;
import com.hanbat.capstone.somoim.dto.FriendRequestResponseDto;
import com.hanbat.capstone.somoim.repository.FriendRequestRepository;
import com.hanbat.capstone.somoim.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendService {

    private final UserRepository userRepository;
    private final FriendRequestRepository friendRequestRepository;

    public FriendService(UserRepository userRepository, FriendRequestRepository friendRequestRepository) {
        this.userRepository = userRepository;
        this.friendRequestRepository = friendRequestRepository;
    }

    // 친구 요청 보내기
    public void sendFriendRequest(String senderNickname, String receiverNickname) {
        Optional<User> sender = userRepository.findByNickname(senderNickname);
        Optional<User> receiver = userRepository.findByNickname(receiverNickname);

        if (sender.isEmpty() || receiver.isEmpty()) {
            throw new IllegalArgumentException("해당 닉네임을 가진 사용자를 찾을 수 없습니다.");
        }

        Optional<FriendRequest> existingRequest = friendRequestRepository.findBySenderAndReceiver(sender.get(), receiver.get());
        if (existingRequest.isPresent()) {
            throw new IllegalArgumentException("이미 친구 요청을 보냈습니다.");
        }

        FriendRequest friendRequest = new FriendRequest();
        friendRequest.setSender(sender.get());
        friendRequest.setReceiver(receiver.get());
        friendRequest.setAccepted(false);

        friendRequestRepository.save(friendRequest);
    }

    // 닉네임을 기준으로 친구 요청을 보내는 사람 목록 조회
    public List<FriendRequestResponseDto> getFriendRequestDtosByNickname(String nickname) {
        // 요청 데이터를 DTO로 변환하여 반환
        List<FriendRequest> friendRequests = friendRequestRepository.findByReceiverNickname(nickname);

        return friendRequests.stream()
                .map(req -> new FriendRequestResponseDto(req.getId(), req.getSender().getNickname(), req.getReceiver().getNickname()))
                .collect(Collectors.toList());
    }

    // 친구 요청 수락
    public void acceptFriendRequest(Long requestId) {
        Optional<FriendRequest> friendRequest = friendRequestRepository.findById(requestId);

        if (friendRequest.isEmpty()) {
            throw new IllegalArgumentException("해당 친구 요청을 찾을 수 없습니다.");
        }

        FriendRequest request = friendRequest.get();
        request.setAccepted(true);

        User sender = request.getSender();
        User receiver = request.getReceiver();
        sender.getFriends().add(receiver);
        receiver.getFriends().add(sender);

        userRepository.save(sender);
        userRepository.save(receiver);

        // 친구 요청을 수락한 후 요청 삭제
        friendRequestRepository.delete(request);
    }

    // 친구 목록 반환
    public List<User> getFriends(String nickname) {
        Optional<User> user = userRepository.findByNickname(nickname);

        if (user.isEmpty()) {
            throw new IllegalArgumentException("해당 닉네임을 가진 사용자를 찾을 수 없습니다.");
        }

        return user.get().getFriends();
    }
    public String getNicknameByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(User::getNickname).orElse(null); // username에 해당하는 nickname 반환
    }
}

