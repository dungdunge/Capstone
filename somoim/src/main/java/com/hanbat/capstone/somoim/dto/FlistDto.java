package com.hanbat.capstone.somoim.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FlistDto {
    private Long id;
    private String username;
    private String nickname;

    public FlistDto(Long id, String username, String nickname) {
        this.id = id;
        this.username = username;
        this.nickname = nickname;
    }
}