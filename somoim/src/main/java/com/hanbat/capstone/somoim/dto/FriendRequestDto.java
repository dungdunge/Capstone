package com.hanbat.capstone.somoim.dto;

import lombok.Getter;
import lombok.Setter;

// 친구 요청을 위한 DTO
@Getter
@Setter
public class FriendRequestDto {
    private String senderNickname;
    private String receiverNickname;

}

