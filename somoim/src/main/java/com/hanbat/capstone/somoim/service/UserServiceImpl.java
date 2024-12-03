package com.hanbat.capstone.somoim.service;



import com.hanbat.capstone.somoim.domain.User;

import com.hanbat.capstone.somoim.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public boolean checkPassword(String rawPw, String encodePw) {
        return passwordEncoder.matches(rawPw, encodePw);
    }

    @Override
    public Optional<User> findByNickname(String nickname) {
        return userRepository.findByNickname(nickname);
    }

    @Override
    public void save(User user) {
        userRepository.save(user);
    }

}
