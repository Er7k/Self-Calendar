package com.g25.selfcalendar.controller;

import com.g25.selfcalendar.dto.LoginDto;
import com.g25.selfcalendar.dto.UserDto;
import com.g25.selfcalendar.entity.User;
import com.g25.selfcalendar.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
This class is used to create endpoints to the user and connect the backend and
frontend code.
@author Simon Ljung
 */

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody User user){
        userService.registerUser(user);

        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getEmail());
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody LoginDto loginRequest) {
        User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());

        if (user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build());

    }

    /**
    @GetMapping("/{id}") is used to get the user by their id.
    This method gets the id of the requested user.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id){
        UserDto userDto = userService.getUserDtoById(id);
        return ResponseEntity.ok(userDto);
    }
}


