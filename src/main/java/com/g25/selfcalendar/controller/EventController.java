package com.g25.selfcalendar.controller;

import com.g25.selfcalendar.exception.ResourceNotFoundException;
import com.g25.selfcalendar.dto.EventDto;
import com.g25.selfcalendar.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

/**
This class is used for creating endpoints to connect the backend and
frontend code.
@author Simon Ljung
 */

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /**
    @GetMapping("/by-date") is used for finding events by the date
    This is useful when a user clicks on a specific date like 2025-04-04,
    it will show all the events for that date.
    @author Simon Ljung
     @return a list of events
     */
    @GetMapping("/by-date")
    public List<EventDto> getEventByDate(@RequestParam String date){
        return eventService.getEventsByDate(Date.valueOf(date));
    }


    /**
    @PostMapping is used for sending data
    This method creates an event
    @author Simon Ljung
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
    @DeleteMapping("/{id}") is used to delete an event using the event id
    The method is used for deleting specific events by their id.
    @author Simon Ljung
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
    @PatchMapping("/{id}") is used for updating certain parts of an event using the id.
    In this method certain parts of the event can be updated when editing an event.
    @author Simon Ljung
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
