package com.hanbat.capstone.somoim.domain;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long roomId;
    private String name;
    private String message;
    private MessageType type;

    private ZonedDateTime timestamp;

    public enum MessageType{
        ENTER, QUIT, CHAT
    }


    public ChatMessage(Long roomId, String name, String message, MessageType type) {
        this.roomId = roomId;
        this.name = name;
        this.message = message;
        this.timestamp = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        this.type = type;
    }

}


