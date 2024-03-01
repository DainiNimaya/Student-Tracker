package com.sms.studentTracker.config;
import com.sms.studentTracker.exception.CustomOauthException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.common.exceptions.InvalidGrantException;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.InMemoryTokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

import java.util.Arrays;

import static com.sms.studentTracker.constant.OAuth2Constant.*;

@Configuration
@EnableAuthorizationServer
@PropertySource("classpath:application.properties")
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

    private static final String RESOURCE_ID = "myrestservice";
    TokenStore tokenStore = new InMemoryTokenStore();

    @Autowired
    @Qualifier("authenticationManagerBean")
    AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private CustomTokenEnhancer customTokenEnhancer; // Inject the CustomTokenEnhancer

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints.tokenStore(tokenStore)
                .authenticationManager(authenticationManager)
                .userDetailsService(userDetailsService)
                .tokenEnhancer(customTokenEnhancer); // Set the custom token enhancer;
    }

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(accessTokenConverter());
    }

    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setSigningKey("your-signing-key"); // Set your signing key here
        return converter;
    }

    @Bean
    @Primary
    public DefaultTokenServices tokenServices(){
        DefaultTokenServices tokenServices = new DefaultTokenServices();
        tokenServices.setTokenStore(this.tokenStore);
        return tokenServices;
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()
                .withClient("myClientApp")
                .authorizedGrantTypes("password","refresh_token")
                .scopes("read","write")
                .secret(encoder().encode("9999")).resourceIds(RESOURCE_ID);
    }

    @Bean
    @Primary
    public BCryptPasswordEncoder encoder(){
        return new BCryptPasswordEncoder();
    }
}
