package com.g25.selfcalendar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;

@SpringBootApplication
public class SelfCalendarApplication {

    public static void main(String[] args) {
        SpringApplication.run(SelfCalendarApplication.class, args);
    }

    HtmlController htmlController = new HtmlController();
}
