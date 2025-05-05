package com.g25.selfcalendar.entity;

import lombok.Data;
import lombok.Getter;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing the user in the calendar.
 * Maps to the "users" table in the database
 */
@Getter
@Setter

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;

    private String password;
    private String email;


}
