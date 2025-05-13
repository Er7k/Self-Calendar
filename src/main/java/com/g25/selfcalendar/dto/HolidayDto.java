package com.g25.selfcalendar.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object (DTO) for representing a public holiday.
 * This class mirrors the structure of a holiday returned from the Nager.Date API
 *
 * Used to display name and date in the frontend calendar view
 *
 * @author Simon Ljung
 */

@Getter
@Setter
public class HolidayDto {
    private String date;
    private String localName;
    private String name;
    private String countryCode;
}
