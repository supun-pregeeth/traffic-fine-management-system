package com.srilanka.trafficfine.dto.response;

import com.srilanka.trafficfine.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String phoneNumber;
    private String district;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .phoneNumber(user.getPhoneNumber())
                .district(user.getDistrict())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
