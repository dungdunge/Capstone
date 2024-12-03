package com.hanbat.capstone.somoim.socket;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.logging.Logger;

@Slf4j
@Component
public class WebSocketEventListener {


    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        log.info("STOMP 연결 시도: {}", event.getMessage());
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        log.info("연결 세부사항: {}", headerAccessor.toString());
    }

    @EventListener
    public void handleWebSocketConnectedListener(SessionConnectedEvent event) {
        log.info("STOMP 연결 성공: 세션 ID: {}", event.getMessage().getHeaders().get("simpSessionId"));
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        log.info("STOMP 연결 해제: 세션 ID: {}", event.getSessionId());
    }
}