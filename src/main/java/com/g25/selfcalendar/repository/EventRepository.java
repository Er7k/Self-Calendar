package com.g25.selfcalendar.repository;

import com.g25.selfcalendar.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.util.List;

/**
 * Repository for accessing and managing {@link Event} entities.
 * Extends {@link JpaRepository} in order to create CRUD operations.
 * @author Frida Larsson
 */

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDate(Date date);
    List<Event> findByDateAndUserId(Date date, Long userId);
    List<Event> findByTitle(String title);

}
