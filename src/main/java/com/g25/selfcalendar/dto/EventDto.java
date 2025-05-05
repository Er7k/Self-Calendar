package com.g25.selfcalendar.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
This class is used to tell the backend what to send to the frontend
@author Simon Ljung
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
