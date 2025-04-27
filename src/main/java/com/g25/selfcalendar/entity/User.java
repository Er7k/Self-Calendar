package com.g25.selfcalendar.entity;

import lombok.Getter;


import jakarta.persistence.*;
import lombok.Getter;

@Getter

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
