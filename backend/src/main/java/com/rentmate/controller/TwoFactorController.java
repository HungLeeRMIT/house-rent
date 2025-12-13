package com.rentmate.controller;

import com.rentmate.model.AuditLog;
import com.rentmate.model.User;
import com.rentmate.repository.UserRepository;
import com.rentmate.service.AuditService;
import com.rentmate.service.TwoFactorService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/2fa")
@CrossOrigin(origins = "*")
public class TwoFactorController {

    @Autowired
    private TwoFactorService twoFactorService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateSecret(Authentication authentication, HttpServletRequest request) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String secret = twoFactorService.generateSecret(user.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("secret", secret);
        response.put("qrCodeUrl", "otpauth://totp/RentMate:" + user.getEmail() + "?secret=" + secret + "&issuer=RentMate");
        response.put("message", "Scan this QR code with your authenticator app");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/enable")
    public ResponseEntity<?> enable2FA(@RequestBody Map<String, String> requestBody,
                                      Authentication authentication,
                                      HttpServletRequest request) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String code = requestBody.get("code");
        
        // Verify code before enabling
        if (!twoFactorService.verifyCode(user.getId(), code)) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid verification code");
            auditService.logAction(user.getId(), user.getUsername(), 
                    AuditLog.ActionType.TWO_FACTOR_ENABLED, AuditLog.Outcome.FAILURE,
                    "2FA enable failed - invalid code", request);
            return ResponseEntity.badRequest().body(error);
        }

        twoFactorService.enable2FA(user.getId(), request);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Two-factor authentication enabled successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/disable")
    public ResponseEntity<?> disable2FA(Authentication authentication, HttpServletRequest request) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        twoFactorService.disable2FA(user.getId(), request);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Two-factor authentication disabled successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> requestBody,
                                       Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String code = requestBody.get("code");
        boolean isValid = twoFactorService.verifyCode(user.getId(), code);
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        response.put("message", isValid ? "Code verified successfully" : "Invalid code");
        
        return ResponseEntity.ok(response);
    }
}

