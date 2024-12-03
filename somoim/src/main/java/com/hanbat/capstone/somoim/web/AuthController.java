package com.hanbat.capstone.somoim.web;


import com.hanbat.capstone.somoim.domain.User;
import com.hanbat.capstone.somoim.jwt.JwtUtil;
import com.hanbat.capstone.somoim.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        if(userService.findByUsername(user.getUsername()).isPresent()){ //받아온 유저데이터의 아이디가 있다면
            return ResponseEntity.badRequest()
                    .body("이 아이디는 사용중입니다.");
        }
        //아이디가 없는 아이디라면 회원가입 시켜주기
        User registUser = userService.registerUser(user);
        return ResponseEntity.ok(registUser);
    }

    // 로그인 성공 시 HttpOnly 및 Secure 쿠키 설정
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginUser) {
        Optional<User> optionalUser = userService.findByUsername(loginUser.getUsername());

        if (optionalUser.isPresent() && userService.checkPassword(loginUser.getPassword(), optionalUser.get().getPassword())) {
            String token = JwtUtil.generateToken(loginUser.getUsername()); // JWT 생성
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response); // JWT를 클라이언트에 반환
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }


    @GetMapping("/getNickname")
    public ResponseEntity<?> getNickname(@RequestHeader("Authorization") String token) {
        String username = JwtUtil.extractUsername(token.replace("Bearer ", ""));
        Optional<User> optionalUser = userService.findByUsername(username);

        if (optionalUser.isPresent()) {
            String nickname = optionalUser.get().getNickname();
            return ResponseEntity.ok(Collections.singletonMap("nickname", nickname));
        }
        return ResponseEntity.status(401).body("User not found");
    }

        @GetMapping("/check-username")
        public ResponseEntity<?> checkUsername(@RequestParam String username) {
            boolean exists = userService.findByUsername(username).isPresent();
            return ResponseEntity.ok(Collections.singletonMap("exists", exists));
        }

    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        boolean exists = userService.findByNickname(nickname).isPresent();
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

}
