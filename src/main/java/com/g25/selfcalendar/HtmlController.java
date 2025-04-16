package com.g25.selfcalendar;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HtmlController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/calendar")
    public String calendarView() {
        return "calendarView";  // This refers to the calendarView.html template in src/main/resources/templates
    }
}
