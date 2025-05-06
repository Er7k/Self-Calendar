package com.g25.selfcalendar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.awt.image.BandCombineOp;

@Configuration
public class SecurityConfig {


    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain (HttpSecurity http) throws Exception{
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        //.requestMatchers("/", "/api/users/login", "/api/users/register",  "/css/**", "/js/**").permitAll()
                        .anyRequest().permitAll()
                        //.anyRequest().authenticated()
                )
                        .formLogin(form -> form.disable())
                        .httpBasic(basic -> basic.disable());
                return http.build();
    }

}
