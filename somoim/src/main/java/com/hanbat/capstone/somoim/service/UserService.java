package com.hanbat.capstone.somoim.service;

import com.hanbat.capstone.somoim.domain.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    Optional<User> findByUsername(String username);

    User registerUser(User user);

    boolean checkPassword(String rawPw, String encodePw);

    Optional<User> findByNickname(String nickname);

    void save(User user);

}
