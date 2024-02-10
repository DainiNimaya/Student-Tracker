package com.sms.studentTracker.utils;


import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class PasswordGenerator {

    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL = "!@#$%^&*()-_=+";
    private static final String ALL = UPPER + LOWER + DIGITS + SPECIAL;
    private static final SecureRandom random = new SecureRandom();

    public static String generate(int length, boolean includeUpper, boolean includeLower, boolean includeDigits, boolean includeSpecial) {
        StringBuilder password = new StringBuilder(length);
        String source = (includeUpper ? UPPER : "") + (includeLower ? LOWER : "") + (includeDigits ? DIGITS : "") + (includeSpecial ? SPECIAL : "");
        if (source.isEmpty()) {
            throw new IllegalArgumentException("At least one character type must be selected");
        }
        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(source.length());
            password.append(source.charAt(randomIndex));
        }
        return password.toString();
    }

    public static void main(String[] args) {
        int length = 12; // Password length
        boolean includeUpper = true; // Include uppercase characters
        boolean includeLower = true; // Include lowercase characters
        boolean includeDigits = true; // Include digits
        boolean includeSpecial = true; // Include special characters

        String password = generate(length, includeUpper, includeLower, includeDigits, includeSpecial);
        System.out.println("Generated Password: " + password);
    }
}
