package com.g25.selfcalendar.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // optional wrapper class can contain either a value or null, to avoid nullpointerexception
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    

}
