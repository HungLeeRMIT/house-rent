package com.rentmate.dto;

import com.rentmate.validation.StrongPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetConfirm {
    
    @NotBlank
    private String token;
    
    @NotBlank
    @StrongPassword
    private String newPassword;
}

