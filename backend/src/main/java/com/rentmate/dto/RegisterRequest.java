package com.rentmate.dto;

import com.rentmate.validation.StrongPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    @StrongPassword
    private String password;
    
    private String firstName;
    private String lastName;
    private String phoneNumber;
    
    @NotBlank
    private String role; // TENANT, LANDLORD, PROPERTY_MANAGER
}

