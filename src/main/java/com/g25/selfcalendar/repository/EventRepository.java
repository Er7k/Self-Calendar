package com.g25.selfcalendar.repository;

import com.g25.selfcalendar.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDate(Date date);
    List<Event> findByTitle(String title);

}
