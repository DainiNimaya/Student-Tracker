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

    // Injecting necessary components
//    private final AuthenticationManager authenticationManager;
//    private final BCryptPasswordEncoder encoder;
//    private final CustomTokenEnhancer customTokenEnhancer;

//    public AuthorizationServerConfig(AuthenticationManager authenticationManager, BCryptPasswordEncoder bCryptPasswordEncoder,
//                                     CustomTokenEnhancer customTokenEnhancer){
//        this.authenticationManager = authenticationManager;
//        this.encoder = bCryptPasswordEncoder;
//        this.customTokenEnhancer = customTokenEnhancer;
//    }
//
//    // Configuring client details for OAuth2 clients
//    @Override
//    public void configure(ClientDetailsServiceConfigurer configurer) throws Exception {
//        configurer
//                .inMemory()
//                .withClient(CLIENT_ID)
//                .secret(CLIENT_SECRET)
//                .authorizedGrantTypes(GRANT_TYPE_PASSWORD, AUTHORIZATION_CODE, REFRESH_TOKEN, IMPLICIT)
//                .scopes(SCOPE_READ, SCOPE_WRITE, TRUST)
//                .accessTokenValiditySeconds(ACCESS_TOKEN_VALIDITY_SECONDS)
//                .refreshTokenValiditySeconds(REFRESH_TOKEN_VALIDITY_SECONDS);
//    }
//
//    @Override
//    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
//        // Setting up a chain of token enhancers
//        TokenEnhancerChain enhancerChain = new TokenEnhancerChain();
//        enhancerChain.setTokenEnhancers(Arrays.asList(tokenEnhancer(), accessTokenConverter()));
//
//        // Configuring authorization server endpoints
//        endpoints.tokenStore(tokenStore())
//                .tokenEnhancer(enhancerChain)
//                .authenticationManager(authenticationManager)
//                .accessTokenConverter(accessTokenConverter())
//                .pathMapping("/oauth/token", "/v1/authorize")  // Mapping the token endpoint to a custom URL
//                .exceptionTranslator(exception -> {
//                    if (exception instanceof InvalidGrantException)
//                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new CustomOauthException("invalid credentials."));
//                    else
//                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new CustomOauthException((exception.getMessage()) != null ?
//                                exception.getMessage(): "Sorry, something went wrong."));
//                });
//    }
//
//    // Bean definition for creating a JwtAccessTokenConverter
//    @Bean
//    public JwtAccessTokenConverter accessTokenConverter() {
//        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
//        converter.setSigningKey(TOKEN_SIGN_IN_KEY);
//        return converter;
//    }
//
//    // Bean definition for creating a JwtTokenStore
//    @Bean
//    public TokenStore tokenStore() {
//        return new JwtTokenStore(accessTokenConverter());
//    }
//
//    // Bean definition for custom TokenEnhancer
//    @Bean
//    public TokenEnhancer tokenEnhancer() {
//        return customTokenEnhancer;
//    }


    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        endpoints.tokenStore(tokenStore)
                .authenticationManager(authenticationManager)
                .userDetailsService(userDetailsService);
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
