 package com.g25.selfcalendar.service;

import com.g25.selfcalendar.dto.UserDto;
import com.g25.selfcalendar.entity.User;
import com.g25.selfcalendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

 /**
  * UserService is responsible for handling businesslogic related
  * to users, such as login, registration and authentification.
  * @author Simon Ljung
  */
 @Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

     /**
      * Constructs a new UserService with dependencies injected
      *
      * @param userRepository repository for users
      * @param passwordEncoder encoder for encrypting passwords
      *
      * @author Simon Ljung
      */
    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

     /**
      * Registers a new user by encoding their password and saving
      * them to the database
      *
      * @param user the user entity to register
      *
      * @author Simon Ljung
      */
    public void registerUser(User user){
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        System.out.println("Encoded password " + encodedPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

     /**
      * Authenticates a user by verifying the username and password
      *
      * @param username of the user
      * @param password raw password to check
      *
      * @return true if authentification is successful otherwise false
      *
      * @author Simon Ljung
      */
    public boolean authenticate(String username, String password){
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return passwordEncoder.matches(password, user.getPassword());
            //return user.getPassword().equals(password);
        }
        return false;
    }

     /**
      * Logs in a user if credentials are valid
      *
      * @param username of the user
      * @param password raw password
      *
      * @return user entity if successful, otherwise null.
      *
      * @author Simon Ljung
      */
    public User login(String username, String password){
        if (authenticate(username, password)) {
            return userRepository.findByUsername(username).orElse(null);
        }
        return null;
    }

     /**
      * Reterives UserDto by the users ID's
      *
      * @param id of the user
      * @return a dto containing id, username and email
      *
      * @author Simon Ljung
      */
    public UserDto getUserDtoById(Long id){
        User user = userRepository.findFirstById(id);

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail()).
                build();
    }

     public UserDto verifyEmail(String email){
         return userRepository.findByEmail(email)
                 .map(user -> new UserDto(user.getId(), user.getUsername(), user.getEmail()))
                 .orElse(null);
     }

     public boolean resetUserPassword(String email, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }
        else {
            return false;
        }
     }
 }


