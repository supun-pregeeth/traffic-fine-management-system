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

    private Long id;
    private String token;
    private String tokenType;
    private String email;
    private String name;
    private String role;

    public static AuthResponse of(Long id, String token, String email, String name, String role) {
        return AuthResponse.builder()
                .id(id)
                .token(token)
                .tokenType("Bearer")
                .email(email)
                .name(name)
                .role(role)
                .build();
    }
}
