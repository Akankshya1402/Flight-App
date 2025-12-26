package com.flightapp.apigateway.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String oldPassword;

    @NotBlank
    @Size(min = 3, message = "Password must be at least 3 characters")
    private String newPassword;
}

