package com.g25.selfcalendar.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import jakarta.validation.constraints.NotNull;

@Builder
public class UserDto {
    private Long id;

    @NotNull
    /*@Size(min = 3, max = 25, message = "Username must be between " +
            "3 and 25 characters")

     */
    private String username;

    @NotNull
    //@Email(message = "Invalid email format")
    private String email;
}
