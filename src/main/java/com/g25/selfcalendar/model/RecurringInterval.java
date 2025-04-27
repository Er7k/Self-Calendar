package com.g25.selfcalendar.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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
    private Long id;




}
