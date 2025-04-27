package com.g25.selfcalendar.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "to_do_list")
public class ToDo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
