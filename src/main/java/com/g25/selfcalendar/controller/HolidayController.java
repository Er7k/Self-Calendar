package com.g25.selfcalendar.controller;

import com.g25.selfcalendar.dto.HolidayDto;
import com.g25.selfcalendar.service.HolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * REST controller for retrieving public holidays using the HolidayService.
 * This controller provides an endpoint to fetch all holidays for a specific year
 * and filter them by month
 *
 * @author Simon Ljung
 */
@RestController
@RequestMapping("/api/holiday")
public class HolidayController {

    private HolidayService holidayService;

    /**
     * Constructor injection for HolidayService
     *
     * @param holidayService the service responsible for fetching the holiday data
     *
     * @author Simon Ljung
     */
    public HolidayController(HolidayService holidayService) {
        this.holidayService = holidayService;
    }

    /**
     * Retrieves a list of holidays for a given year and country.
     * Optionally filter by month also
     *
     * @param year to fetch the holidays
     * @param countryCode the country where the data is fetched from
     * @param month to filter the holidays
     * @return a list of {@link HolidayDto} matching the criteria
     *
     * @author Simon Ljung
     */
    @GetMapping
    public ResponseEntity<List<HolidayDto>> getHolidays(@RequestParam int year,
                                                        @RequestParam String countryCode,
                                                        @RequestParam(required = false) Integer month) {
        List<HolidayDto> holidays = holidayService.getHolidays(year, countryCode);

        if (month != null){
            List<HolidayDto> filtered = new ArrayList<>();
            for (HolidayDto holidayDto : holidays){
                LocalDate holidayDate = LocalDate.parse(holidayDto.getDate());
                if (holidayDate.getMonthValue() == month){
                    filtered.add(holidayDto);
                }
            }
            holidays = filtered;
        }
        return ResponseEntity.ok(holidays);
    }
}
