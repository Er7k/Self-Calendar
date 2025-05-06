package com.g25.selfcalendar.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * Data Transfer Objects for transferring data between
 * frontend and backend. This class encapsulates only the necessary
 * fields for the client interactions.
 */


@Getter
@Setter
@NoArgsConstructor

public class EventDto {
    private Long id;
    private String title;
    private String date;
    private String startTime;
    private String endTime;
    private Boolean recurring;
    private Boolean allDay;
    private Long userId;
    private Long recurringIntervalId;
    private String description;

}
