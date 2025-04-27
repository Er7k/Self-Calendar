package com.g25.selfcalendar.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Setter;

@Entity
@Table(name = "users")
public class User {
    //@GeneratedValue //??
    @Id
    private Long id;
    private String username;

    private String password;
    private String email;

}
