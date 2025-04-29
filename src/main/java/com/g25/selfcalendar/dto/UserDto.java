package com.g25.selfcalendar.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

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

    public UserDto(Long id, String username, String email){
        this.id = id;
        this.username = username;
        this.email = email;
    }
}
