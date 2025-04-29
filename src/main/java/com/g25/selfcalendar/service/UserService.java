 package com.g25.selfcalendar.service;

import com.g25.selfcalendar.dto.UserDto;
import com.g25.selfcalendar.entity.User;
import com.g25.selfcalendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(User user){
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        System.out.println("Encoded password " + encodedPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    public boolean authenticate(String username, String password){
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return passwordEncoder.matches(password, user.getPassword());
            //return user.getPassword().equals(password);
        }
        return false;
    }

    public User login(String username, String password){
        if (authenticate(username, password)) {
            return userRepository.findByUsername(username).orElse(null);
        }
        return null;
    }

    public UserDto getUserDtoById(Long id){
        User user = userRepository.findFirstById(id);

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail()).
                build();
    }
}


