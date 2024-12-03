package com.hanbat.capstone.somoim.config;


import com.hanbat.capstone.somoim.repository.UserRepository;
import com.hanbat.capstone.somoim.service.UserService;
import com.hanbat.capstone.somoim.service.UserServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserService userService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        return new UserServiceImpl(userRepository, passwordEncoder);
    }


}
