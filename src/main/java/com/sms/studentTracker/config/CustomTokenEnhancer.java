package com.sms.studentTracker.config;

import com.sms.studentTracker.dto.UserDTO;
import com.sms.studentTracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class CustomTokenEnhancer extends JwtAccessTokenConverter {

    private final UserService userService;

    @Autowired
    public CustomTokenEnhancer(UserService userService) {
        this.userService = userService;
    }

    // Enhance the OAuth2 access token with custom information
    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken oAuth2AccessToken, OAuth2Authentication oAuth2Authentication) {
        final Map<String, Object> additionalInfo = new HashMap<>();

        // Get the user information from the authentication context
        User user = (User) oAuth2Authentication.getPrincipal();

        // Get the current authentication
        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        // Check if the user is the admin client
//        if (user.getUsername().equals(OAuth2Constant.ADMIN_CLIENT_ID)) {
            // Retrieve additional user details from the UserService
            UserDTO userDetailsByUserEmail = userService.getUserDetailsByUserEmail(user.getUsername());

            // Add custom information to the access token's additional claims
            additionalInfo.put("user", userDetailsByUserEmail);
            additionalInfo.put("user_id", userDetailsByUserEmail.getId());
//        }

        // Set the custom claims in the access token
        ((DefaultOAuth2AccessToken) oAuth2AccessToken).setAdditionalInformation(additionalInfo);

        // Call the parent's enhance method to complete token enhancement
        return super.enhance(oAuth2AccessToken, oAuth2Authentication);
    }
}
