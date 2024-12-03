package com.hanbat.capstone.somoim.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // 채팅방 이름
    private String category;

    // 채팅방 생성자(본인)
    private String creatorNickname;

    // 1:1 채팅 상대방
    private String otherUserNickname;

    public ChatRoom(String name, String category, String creatorNickname, String otherUserNickname) {
        this.name = name;
        this.category = category;
        this.creatorNickname = creatorNickname;
        this.otherUserNickname = otherUserNickname;
    }
}
