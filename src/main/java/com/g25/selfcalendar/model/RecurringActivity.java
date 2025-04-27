package com.g25.selfcalendar.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Time;


@Getter // slippa skriva alla metoder
@Setter // slippa skriva alla metoder
@NoArgsConstructor // slippa skriva constructor
@AllArgsConstructor //constructor med alla parametrar
@Builder // creates a builder pattern for the class, makes it easier to create objects
@Entity
@Table(name = "recurring_activities")
public class RecurringActivity {

    @Column(name = "time")
    private Time time;


    @Column(name = "title")
    private String title;

    @Id
    @Column(name = "id")
    private Long id;

}
