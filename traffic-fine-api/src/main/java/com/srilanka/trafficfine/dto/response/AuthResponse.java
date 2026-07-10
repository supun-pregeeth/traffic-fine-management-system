package com.srilanka.trafficfine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType;
    private String email;
    private String name;
    private String role;
    private Long id;

    public static AuthResponse of(String token, String email, String name, String role, Long id) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(email)
                .name(name)
                .role(role)
                .id(id)
                .build();
    }
}
