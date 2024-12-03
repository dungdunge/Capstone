package com.hanbat.capstone.somoim.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestResponseDto {
    private Long requestId;
    private String senderNickname;
    private String receiverNickname;

    public FriendRequestResponseDto(Long requestId, String senderNickname, String receiverNickname) {
        this.requestId = requestId;
        this.senderNickname = senderNickname;
        this.receiverNickname = receiverNickname;
    }
}