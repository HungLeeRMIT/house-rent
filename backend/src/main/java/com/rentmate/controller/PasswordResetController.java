package com.rentmate.controller;

import com.rentmate.dto.PasswordResetConfirm;
import com.rentmate.dto.PasswordResetRequest;
import com.rentmate.service.PasswordResetService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/password-reset")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/request")
    public ResponseEntity<?> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request,
                                                  HttpServletRequest httpRequest) {
        boolean success = passwordResetService.requestPasswordReset(request.getEmail(), httpRequest);
        
        // Always return success message (security best practice - don't reveal if email exists)
        Map<String, String> response = new HashMap<>();
        response.put("message", "If the email exists, a password reset link has been sent.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirm confirm,
                                                  HttpServletRequest request) {
        boolean success = passwordResetService.confirmPasswordReset(
                confirm.getToken(), 
                confirm.getNewPassword(), 
                request);
        
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password has been reset successfully. You can now login with your new password.");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid or expired reset token.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}

