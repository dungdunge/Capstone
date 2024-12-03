package com.hanbat.capstone.somoim.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChatRoomRequest {
    private String name;
    private String category;
    private String creatorNickname;
}
