package com.g25.selfcalendar.repository;

import com.g25.selfcalendar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository interface for accessing and managing {@link User} entities.
 * Extends {@link JpaRepository} to create CRUD operations
 * @author Frida Larsson, Simon Ljung
 */
public interface UserRepository extends JpaRepository<User, Long> {
    // optional wrapper class can contain either a value or null, to avoid nullpointerexception

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);


    User findFirstById(Long id);

}
