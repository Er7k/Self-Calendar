package com.g25.selfcalendar.controller;

import com.g25.selfcalendar.dto.HolidayDto;
import com.g25.selfcalendar.entity.Event;
import com.g25.selfcalendar.exception.ResourceNotFoundException;
import com.g25.selfcalendar.dto.EventDto;
import com.g25.selfcalendar.repository.UserRepository;
import com.g25.selfcalendar.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * REST controller for managing calendar events.
 * This class has endpoints for creating, retrieving, updating and deleting.
 *
 * These endpoints are used to connect backend and frontend
 *
 * @author Simon Ljung
 */

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    public EventController(EventService eventService, UserRepository userRepository) {
        this.eventService = eventService;
        this.userRepository = userRepository;
    }

    private void validateUser(Long userId){
        if (userId == null || !userRepository.existsById(userId)){
            throw new ResourceNotFoundException("User with ID " + userId + " not found");
        }
    }
    /**
     * @GetMapping("/by-date") is used for finding events by the date
     * This is useful when a user clicks on a specific date like 2025-04-04,
     * it will show all the events for that date.
     *
     * @param date the date in format (yyyy-mm-dd)
     * @return a list of events {@link EventDto} objects
     */
    @GetMapping("/by-date")
    public List<EventDto> getEventByDate(@RequestParam String date, @RequestParam Long userId){
        return eventService.getEventsByDate(Date.valueOf(date), userId);
    }

    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents(@RequestParam Long userId) {
        List<EventDto> events = eventService.getAllEventsByUser(userId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/by-week")
    public ResponseEntity<List<EventDto>> getEventsByWeek(
            @RequestParam String startDate,
            @RequestParam Long userId) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = start.plusDays(6);
        List<EventDto> events = eventService.getEventsBetweenDates(Date.valueOf(start), Date.valueOf(end), userId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/by-month")
    public ResponseEntity<List<EventDto>> getEventsByMonth(
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam Long userId) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        List<EventDto> events = eventService.getEventsBetweenDates(Date.valueOf(start), Date.valueOf(end), userId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/by-year")
    public ResponseEntity<List<EventDto>> getEventsByYear(
            @RequestParam int year,
            @RequestParam Long userId) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);
        List<EventDto> events = eventService.getEventsBetweenDates(Date.valueOf(start), Date.valueOf(end), userId);
        return ResponseEntity.ok(events);
    }

    /**
     * @PostMapping is used for sending data.
     * This method creates an event
     * @return the created event with its ID and saved properties
     *
     * @author Simon Ljung
     */
    @PostMapping
    public ResponseEntity<EventDto> createEvent(@RequestBody EventDto eventDto){
        try {
            EventDto createdEvent = eventService.createEvent(eventDto);  // Convert to entity and save
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * @DeleteMapping("/{id}") is used to delete an event using the event id
     * The method is used for deleting specific events by their id.
     * @param id of the event to delete
     * @return HTTP 204 No content if deleted, or 404 Not Found if the id isn't found
     * @author Simon Ljung
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * @PatchMapping("/{id}") is used for updating certain parts of an event using the id.
     * In this method certain parts of the event can be updated when editing an event.
     * @param id of the event to update
     * @param eventDto the updated eventDTO
     * @return the updated {@link EventDto} or 404 if the event is not found
     * @author Simon Ljung
     */
    @PatchMapping("/{id}")
    public ResponseEntity<EventDto> partialUpdateEvent(@PathVariable Long id, @RequestBody EventDto eventDto){
        try {
            EventDto updatedEvent = eventService.partialUpdateEvent(id, eventDto);
            return ResponseEntity.ok(updatedEvent);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}
