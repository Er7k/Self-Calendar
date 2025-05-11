package com.g25.selfcalendar.controller;

import com.g25.selfcalendar.dto.LoginDto;
import com.g25.selfcalendar.dto.PasswordResetDto;
import com.g25.selfcalendar.dto.UserDto;
import com.g25.selfcalendar.entity.User;
import com.g25.selfcalendar.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing user-related operations such as
 * login, register and retrieval.
 *
 * This controller acts as a bridge between the backend and frontend logic
 * @author Simon Ljung
 */

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register a new user with the provided information
     *
     * @param user containing the id, username, email and password.
     * @return the registered user as a {@link UserDto}
     *
     * @author Simon Ljung
     */
    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody User user){
        userService.registerUser(user);

        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getEmail());
        return ResponseEntity.ok(userDto);
    }

    /**
     * Logs in a user using the provided login credentials
     *
     * @param loginRequest an object containing the username and password
     * @return the authenticated user's {@link UserDto} or 401 Unauthorized
     * if login fails
     *
     * @author Simon Ljung
     */
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
     * @GetMapping("/{id}") is used to get the user by their id.
     * This method gets the id of the requested user.
     * @param id the ID of the user to retrieve
     * @return the user's {@link UserDto} if found
     *
     * @author Simon Ljung
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id){
        UserDto userDto = userService.getUserDtoById(id);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<UserDto> getUserByEmail(@RequestBody UserDto userDto){
        UserDto user = userService.verifyEmail(userDto.getEmail());
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDto dto){
        boolean success = userService.resetUserPassword(dto.getEmail(), dto.getNewPassword());
        if (success){
            return ResponseEntity.ok().build();
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reset password failed");
        }
    }
}


