package com.srilanka.trafficfine.service.impl;

import com.srilanka.trafficfine.dto.request.LoginRequest;
import com.srilanka.trafficfine.dto.request.RegisterRequest;
import com.srilanka.trafficfine.dto.response.AuthResponse;
import com.srilanka.trafficfine.entity.User;
import com.srilanka.trafficfine.exception.BadRequestException;
import com.srilanka.trafficfine.repository.UserRepository;
import com.srilanka.trafficfine.security.JwtTokenProvider;
import com.srilanka.trafficfine.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles user registration and JWT-based login.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .phoneNumber(request.getPhoneNumber())
                .district(request.getDistrict())
                .build();

        userRepository.save(user);
        log.info("New user registered: {} [{}]", user.getEmail(), user.getRole());

        String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
        return AuthResponse.of(token, user.getEmail(), user.getName(), user.getRole().name(), user.getId());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Spring Security validates credentials; throws BadCredentialsException on failure
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        log.info("User logged in: {} [{}]", user.getEmail(), user.getRole());
        return AuthResponse.of(token, user.getEmail(), user.getName(), user.getRole().name(), user.getId());
    }
}
