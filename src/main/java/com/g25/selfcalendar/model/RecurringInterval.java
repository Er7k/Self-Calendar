package com.g25.selfcalendar.model;


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
    private Long id;


    // en till många relationship en recurring interval till många events
    @OneToMany(fetch = FetchType.LAZY) // lazy = User object will be loaded lazily (only when needed)
    // kan bytas till .EAGER = load the User immediately when the Event is loaded
    @JoinColumn(name = "event_id")
    private Event event; // foregin key user


}
