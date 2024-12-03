package com.hanbat.capstone.somoim.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrivateChatRoomRequest {
    private String creatorNickname;
    private String otherUserNickname;
}