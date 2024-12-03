package com.hanbat.capstone.somoim.repository;

import com.hanbat.capstone.somoim.domain.User;
import com.hanbat.capstone.somoim.dto.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);
    List<FriendRequest> findByReceiverNickname(String receiverNickname);
}
