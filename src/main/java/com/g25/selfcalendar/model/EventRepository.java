package com.g25.selfcalendar.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDate(Date date);
    List<Event> findByTitle(String title);

}
