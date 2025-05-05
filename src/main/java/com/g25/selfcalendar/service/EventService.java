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

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RecurringIntervalRepository recurringIntervalRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository, RecurringIntervalRepository recurringIntervalRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.recurringIntervalRepository = recurringIntervalRepository;
    }

    public List<EventDto> getEventsByDate(Date date){
        List<Event> events = eventRepository.findByDate(date);
        List<EventDto> dtoList = new ArrayList<>();

        for (int i = 0; i < events.size(); i++){
            Event event = events.get(i);
            EventDto eventDto = toDto(event);
            dtoList.add(eventDto);
        }
        return dtoList;
    }

    public EventDto createEvent (EventDto dto){
        Event event = fromDto(dto);
        Event saved = eventRepository.save(event);
        return toDto(saved);
    }

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
    This method is used to delete events using their id
    @author Simon Ljung
     */
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)){
            throw new IllegalArgumentException("Event with ID" + id + " does not exist");
        }
        eventRepository.deleteById(id);
    }


    /**
    This method is used when updating events. If a request to change specific
    information about an event is made, it will update using this method.
    @return updated event
    @author Simon Ljung
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
}
