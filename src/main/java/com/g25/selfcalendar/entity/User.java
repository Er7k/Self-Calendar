package com.g25.selfcalendar.entity;

import lombok.Data;
import lombok.Getter;


import jakarta.persistence.*;


@Getter
@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, name = "user_name")
    private String username;

    @Column(nullable = false, name = "password")
    private String password;

    @Column(unique = true, nullable = false, name = "email")
    private String email;


}
