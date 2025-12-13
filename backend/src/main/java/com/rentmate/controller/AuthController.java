package com.rentmate.controller;

import com.rentmate.dto.AuthRequest;
import com.rentmate.dto.AuthResponse;
import com.rentmate.dto.RegisterRequest;
import com.rentmate.model.AuditLog;
import com.rentmate.model.User;
import com.rentmate.repository.UserRepository;
import com.rentmate.security.JwtUtil;
import com.rentmate.service.AuditService;
import com.rentmate.service.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RateLimitService rateLimitService;

    @Autowired
    private AuditService auditService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest,
                                          HttpServletRequest request) {
        // Check if username exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Username is already taken!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Check if email exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email is already in use!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Create new user
        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(User.UserRole.valueOf(registerRequest.getRole().toUpperCase()))
                .isActive(true)
                .twoFactorEnabled(false)
                .failedLoginAttempts(0)
                .build();

        userRepository.save(user);

        // Audit log
        auditService.logAction(user.getId(), user.getUsername(), 
                AuditLog.ActionType.LOGIN_SUCCESS, AuditLog.Outcome.SUCCESS,
                "User registered successfully", request);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest authRequest,
                                              HttpServletRequest request) {
        User user = userRepository.findByUsername(authRequest.getUsername()).orElse(null);
        
        // Check if account is locked
        if (user != null && rateLimitService.isAccountLocked(user)) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Account is temporarily locked due to too many failed login attempts. Please try again later.");
            auditService.logAction(user.getId(), user.getUsername(), 
                    AuditLog.ActionType.LOGIN_FAILURE, AuditLog.Outcome.DENIED,
                    "Login attempt blocked - account locked", request);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Reset failed login attempts on successful login
            rateLimitService.resetFailedLoginAttempts(authRequest.getUsername());
            
            // Get user for 2FA check
            user = userRepository.findByUsername(authRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if 2FA is enabled
            if (user.getTwoFactorEnabled() != null && user.getTwoFactorEnabled()) {
                Map<String, Object> response = new HashMap<>();
                response.put("requires2FA", true);
                response.put("message", "Two-factor authentication required");
                auditService.logAction(user.getId(), user.getUsername(), 
                        AuditLog.ActionType.TWO_FACTOR_VERIFIED, AuditLog.Outcome.SUCCESS,
                        "2FA verification required", request);
                return ResponseEntity.ok(response);
            }

            String jwt = jwtUtil.generateToken(userDetails);

            // Audit log successful login
            auditService.logAction(user.getId(), user.getUsername(), 
                    AuditLog.ActionType.LOGIN_SUCCESS, AuditLog.Outcome.SUCCESS,
                    "User logged in successfully", request);

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name()
            ));
        } catch (BadCredentialsException e) {
            // Record failed login attempt
            rateLimitService.recordFailedLoginAttempt(authRequest.getUsername(), request);
            
            // Audit log failed login
            if (user != null) {
                auditService.logAction(user.getId(), user.getUsername(), 
                        AuditLog.ActionType.LOGIN_FAILURE, AuditLog.Outcome.FAILURE,
                        "Invalid credentials", request);
            } else {
                auditService.logAction(null, authRequest.getUsername(), 
                        AuditLog.ActionType.LOGIN_FAILURE, AuditLog.Outcome.FAILURE,
                        "Invalid credentials - user not found", request);
            }
            
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username or password!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Authentication failed. Please try again.");
            auditService.logAction(null, authRequest.getUsername(), 
                    AuditLog.ActionType.LOGIN_FAILURE, AuditLog.Outcome.ERROR,
                    "Authentication error: " + e.getMessage(), request);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}
