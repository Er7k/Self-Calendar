package com.g25.selfcalendar.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetDto {
    private String email;
    private String newPassword;
}
