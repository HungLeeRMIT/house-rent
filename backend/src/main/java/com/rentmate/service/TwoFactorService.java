package com.rentmate.service;

import com.rentmate.model.AuditLog;
import com.rentmate.model.User;
import com.rentmate.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class TwoFactorService {

    private static final int SECRET_LENGTH = 20;
    private static final int CODE_LENGTH = 6;
    private static final int TIME_STEP = 30; // 30 seconds

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    @Transactional
    public String generateSecret(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SecureRandom random = new SecureRandom();
        byte[] secretBytes = new byte[SECRET_LENGTH];
        random.nextBytes(secretBytes);
        String secret = Base32.encode(secretBytes);

        user.setTwoFactorSecret(secret);
        userRepository.save(user);

        return secret;
    }

    @Transactional
    public void enable2FA(Long userId, HttpServletRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getTwoFactorSecret() == null) {
            generateSecret(userId);
            user = userRepository.findById(userId).orElseThrow();
        }

        user.setTwoFactorEnabled(true);
        userRepository.save(user);

        auditService.logAction(userId, user.getUsername(), 
                AuditLog.ActionType.TWO_FACTOR_ENABLED, AuditLog.Outcome.SUCCESS,
                "2FA enabled", request);
    }

    @Transactional
    public void disable2FA(Long userId, HttpServletRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        userRepository.save(user);

        auditService.logAction(userId, user.getUsername(), 
                AuditLog.ActionType.TWO_FACTOR_DISABLED, AuditLog.Outcome.SUCCESS,
                "2FA disabled", request);
    }

    public boolean verifyCode(Long userId, String code) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getTwoFactorSecret() == null) {
            return false;
        }

        long currentTime = System.currentTimeMillis() / 1000 / TIME_STEP;
        
        // Check current time window and adjacent windows (for clock skew)
        for (int i = -1; i <= 1; i++) {
            String expectedCode = generateTOTP(user.getTwoFactorSecret(), currentTime + i);
            if (code.equals(expectedCode)) {
                return true;
            }
        }

        return false;
    }

    private String generateTOTP(String secret, long time) {
        try {
            byte[] secretBytes = Base32.decode(secret);
            byte[] timeBytes = new byte[8];
            for (int i = 7; i >= 0; i--) {
                timeBytes[i] = (byte) (time & 0xFF);
                time >>= 8;
            }

            Mac mac = Mac.getInstance("HmacSHA1");
            SecretKeySpec keySpec = new SecretKeySpec(secretBytes, "HmacSHA1");
            mac.init(keySpec);
            byte[] hash = mac.doFinal(timeBytes);

            int offset = hash[hash.length - 1] & 0x0F;
            int code = ((hash[offset] & 0x7F) << 24) |
                      ((hash[offset + 1] & 0xFF) << 16) |
                      ((hash[offset + 2] & 0xFF) << 8) |
                      (hash[offset + 3] & 0xFF);
            code = code % 1000000;

            return String.format("%06d", code);
        } catch (Exception e) {
            throw new RuntimeException("Error generating TOTP", e);
        }
    }

    // Simple Base32 encoding/decoding (RFC 4648)
    private static class Base32 {
        private static final String BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

        public static String encode(byte[] data) {
            StringBuilder result = new StringBuilder();
            int buffer = 0;
            int bitsLeft = 0;

            for (byte b : data) {
                buffer = (buffer << 8) | (b & 0xFF);
                bitsLeft += 8;

                while (bitsLeft >= 5) {
                    result.append(BASE32_CHARS.charAt((buffer >> (bitsLeft - 5)) & 0x1F));
                    bitsLeft -= 5;
                }
            }

            if (bitsLeft > 0) {
                result.append(BASE32_CHARS.charAt((buffer << (5 - bitsLeft)) & 0x1F));
            }

            return result.toString();
        }

        public static byte[] decode(String encoded) {
            int buffer = 0;
            int bitsLeft = 0;
            int count = 0;
            byte[] result = new byte[(encoded.length() * 5) / 8];

            for (char c : encoded.toCharArray()) {
                int value = BASE32_CHARS.indexOf(c);
                if (value < 0) continue;

                buffer = (buffer << 5) | value;
                bitsLeft += 5;

                if (bitsLeft >= 8) {
                    result[count++] = (byte) ((buffer >> (bitsLeft - 8)) & 0xFF);
                    bitsLeft -= 8;
                }
            }

            byte[] finalResult = new byte[count];
            System.arraycopy(result, 0, finalResult, 0, count);
            return finalResult;
        }
    }
}

