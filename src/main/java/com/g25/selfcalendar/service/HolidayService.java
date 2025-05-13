package com.g25.selfcalendar.service;

import com.g25.selfcalendar.dto.HolidayDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * Service class responsible for fetching public holidays from external API (Nager.Date).
 * This class uses {@link RestTemplate} to call the api and retrieve holidays based on year
 * and country code
 *
 * API used: https://date.nager.at
 *
 * @author Simon Ljung
 */
@Service
public class HolidayService {

    private final RestTemplate restTemplate;

    /**
     * Constructor injection of RestTemplate
     *
     * @param restTemplate used to make extrenal HTTP calls.
     *
     * @author Simon Ljung
     */
    public HolidayService(RestTemplate restTemplate){
        this.restTemplate = restTemplate;
    }


    /**
     * Fetches holidays for the specified year and country from Nager.Date API.
     *
     * @param year to fetch the holidays from
     * @param countryCode the country code of a certain country
     * @return a list of {@link HolidayDto} objects representing the holidays
     *
     * @author Simon Ljung
     */
    public List<HolidayDto> getHolidays (int year, String countryCode) {
        String url = "https://date.nager.at/api/v3/PublicHolidays/" + year + "/" + countryCode;
        ResponseEntity<HolidayDto[]> response = restTemplate.getForEntity(url, HolidayDto[].class);
        return Arrays.asList(response.getBody());
    }
}
