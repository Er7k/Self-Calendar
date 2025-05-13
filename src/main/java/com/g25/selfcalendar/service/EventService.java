package com.g25.selfcalendar.service;

import com.g25.selfcalendar.exception.ResourceNotFoundException;
import com.g25.selfcalendar.dto.EventDto;
import com.g25.selfcalendar.entity.Event;
import com.g25.selfcalendar.entity.RecurringInterval;
import com.g25.selfcalendar.entity.User;
import com.g25.selfcalendar.repository.EventRepository;
import com.g25.selfcalendar.repository.RecurringIntervalRepository;
import com.g25.selfcalendar.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.sql.Date;

/**
 * Service class for handling business logic related to
 * calendar events. Provides methods to create, retrieve and
 * delete events.
 *
 * @author Simon Ljung
 */

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RecurringIntervalRepository recurringIntervalRepository;

    /**
     * Constructs an eventservice with required repositories
     *
     * @param eventRepository repository for events
     * @param userRepository repository for users
     * @param recurringIntervalRepository repository for recurring intervals
     *
     * @author Simon Ljung
     */
    public EventService(EventRepository eventRepository, UserRepository userRepository, RecurringIntervalRepository recurringIntervalRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.recurringIntervalRepository = recurringIntervalRepository;
    }

    /**
     * Retrieves all events from a specific date
     *
     * @param date the date to find events by
     * @param userId the id from the specific user
     * @return a list of EventDto objects matching the date
     *
     * @author Simon Ljung
     */
    public List<EventDto> getEventsByDate(Date date, Long userId){
        List<Event> events = eventRepository.findByDateAndUserId(date, userId);
        //List<Event> events = eventRepository.findByDate(date);
        List<EventDto> dtoList = new ArrayList<>();

        for (int i = 0; i < events.size(); i++){
            Event event = events.get(i);
            EventDto eventDto = toDto(event);
            dtoList.add(eventDto);
        }
        return dtoList;
    }

    /**
     * Creates a new event from a DTO
     *
     * @param dto the event data to create
     * @return the created event data
     *
     * @author Simon Ljung
     */
    public EventDto createEvent (EventDto dto){
        Event event = fromDto(dto);
        Event saved = eventRepository.save(event);
        return toDto(saved);
    }

    /**
     * Converts an entity to an EventDto.
     *
     * @param event the entity to convert
     * @return the correct DTO
     *
     * @author Simon Ljung
     */
    public EventDto toDto(Event event){
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDate(event.getDate().toString());
        dto.setStartTime(event.getStartTime().toString());
        dto.setEndTime(event.getEndTime().toString());
        dto.setRecurring(event.isRecurring());
        dto.setAllDay(event.isAllDay());
        dto.setDescription(event.getDescription());

        if (event.getUser() != null){
            dto.setUserId(event.getUser().getId());
        } else {
            dto.setUserId(null);
        }

        if (event.getRecurringInterval() != null){
            dto.setRecurringIntervalId(event.getRecurringInterval().getId());
        } else {
            dto.setRecurringIntervalId(null);
        }

        return dto;
    }

    /**
     * Converts an EventDTO to an event entity
     *
     * @param dto the DTO to convert
     * @return the corresponding entity
     *
     * @author Simon Ljung
     */
    public Event fromDto(EventDto dto){
        Event event = new Event();
        event.setId(dto.getId() != null ? dto.getId() : 0);
        event.setTitle(dto.getTitle());
        event.setDate(Date.valueOf(dto.getDate()));
        event.setStartTime(Time.valueOf(dto.getStartTime()));
        event.setEndTime(Time.valueOf(dto.getEndTime()));
        event.setRecurring(dto.getRecurring());
        event.setAllDay(dto.getRecurring());
        event.setDescription(dto.getDescription());

        if (dto.getUserId() != null){
            Optional<User> userOptional = userRepository.findById(dto.getUserId());
            if (userOptional.isPresent()){
                event.setUser(userOptional.get());
            }
        }

        if (dto.getRecurringIntervalId() != null){
            Optional<RecurringInterval> intervalOptional = recurringIntervalRepository.findById(dto.getRecurringIntervalId());
            if (intervalOptional.isPresent()){
                event.setRecurringInterval(intervalOptional.get());
            }
        }
        return event;
    }

    /**
     * Deletes an event by its ID
     *
     * @param id of the event to delete
     * @throws IllegalArgumentException if the event doesnt exist
     *
     * @author Simon Ljung
     */
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)){
            throw new IllegalArgumentException("Event with ID" + id + " does not exist");
        }
        eventRepository.deleteById(id);
    }


    /**
     * Partially updates an event with the fields provided in
     * the DTO.
     * Non-null values will be updated
     *
     * @param id of the event to update
     * @param eventDto the DTO containing the updated data
     * @return updated EventDTO
     * @throws ResourceNotFoundException if no event with the given
     * ID is found
     *
     * @author Simon Ljung
     */
    public EventDto partialUpdateEvent(Long id, EventDto eventDto){
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("event not found with ID " + id));
        //Uppdaterar enbart fälten som är efterfrågade
        if (eventDto.getTitle() != null){
            existingEvent.setTitle(eventDto.getTitle());
        }
        if (eventDto.getDate() != null) {
            existingEvent.setDate(Date.valueOf(eventDto.getDate()));
        }
        if (eventDto.getStartTime() != null) {
            existingEvent.setStartTime(Time.valueOf(eventDto.getStartTime()));
        }
        if (eventDto.getEndTime() != null) {
            existingEvent.setEndTime(Time.valueOf(eventDto.getEndTime()));
        }
        if (eventDto.getDescription() != null) {
            existingEvent.setDescription(eventDto.getDescription());
        }
        if (eventDto.getRecurring() != null) {
            existingEvent.setRecurring(eventDto.getRecurring());
        }
        if (eventDto.getAllDay() != null) {
            existingEvent.setAllDay(eventDto.getAllDay());
        }

        eventRepository.save(existingEvent);
        return toDto(existingEvent);
    }

    public List<EventDto> getEventsBetweenDates(Date startDate, Date endDate, Long userId){
        List<Event> events = eventRepository.findAllByDateBetweenAndUserId(startDate, endDate, userId);
        List<EventDto> eventDtos = new ArrayList<>();

        for (Event event : events){
            EventDto dto = new EventDto();
            dto.setId(event.getId());
            dto.setTitle(event.getTitle());
            dto.setDate(event.getDate().toString());
            dto.setStartTime(event.getStartTime().toString());
            dto.setEndTime(event.getEndTime().toString());
            dto.setRecurring(event.isRecurring());
            dto.setAllDay(event.isAllDay());
            dto.setDescription(event.getDescription());
            dto.setUserId(event.getUser().getId());

            if (event.getRecurringInterval() != null){
                dto.setRecurringIntervalId(event.getRecurringInterval().getId());
            }

            eventDtos.add(dto);
        }
        return eventDtos;
    }
}
