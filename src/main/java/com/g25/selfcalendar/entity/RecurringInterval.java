package com.g25.selfcalendar.entity;


import jakarta.persistence.*;
import lombok.*;

@Getter // slippa skriva alla metoder
@Setter // slippa skriva alla metoder
@NoArgsConstructor // slippa skriva constructor
@AllArgsConstructor //constructor med alla parametrar
@Builder // creates a builder pattern for the class, makes it easier to create objects
@Entity
@Table(name = "recurring_intervals")
public class RecurringInterval {

    @Column(name = "id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;




}
