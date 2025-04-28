package com.g25.selfcalendar.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.sql.Time;

@Getter // slippa skriva alla metoder
@Setter // slippa skriva alla metoder
@NoArgsConstructor // slippa skriva constructor
@AllArgsConstructor //constructor med alla parametrar
@Builder // creates a builder pattern for the class, makes it easier to create objects
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "title")
    private String title;

    @Column(name = "date")
    private Date date;

    @Column(name = "start_time")
    private Time startTime;

    @Column(name = "end_time")
    private Time endTime;

    @Column(name = "recurring")
    private boolean recurring;

    @Column(name = "all_day")
    private boolean allDay;

    // många till en relationship många event till en user
    @ManyToOne(fetch = FetchType.LAZY) // lazy = User object will be loaded lazily (only when needed)
    // kan bytas till .EAGER = load the User immediately when the Event is loaded
    @JoinColumn(name = "user_id")
    private User user; // foregin key user

    // många event till en recurring interval
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rec_id")
    private RecurringInterval recurringInterval;


}


