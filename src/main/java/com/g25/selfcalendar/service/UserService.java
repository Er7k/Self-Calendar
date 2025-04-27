package com.g25.selfcalendar.service;

import com.g25.selfcalendar.dto.UserDto;
import com.g25.selfcalendar.entity.User;
import com.g25.selfcalendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
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
