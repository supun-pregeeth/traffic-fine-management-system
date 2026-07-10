package com.srilanka.trafficfine.dto.response;

import com.srilanka.trafficfine.entity.NotificationLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationLogResponse {

    private Long id;
    private String phoneNumber;
    private String message;
    private String status;
    private String recipientName;
    private String fineReference;
    private LocalDateTime sentAt;

    public static NotificationLogResponse from(NotificationLog log) {
        return NotificationLogResponse.builder()
                .id(log.getId())
                .phoneNumber(log.getPhoneNumber())
                .message(log.getMessage())
                .status(log.getStatus() != null ? log.getStatus().name() : null)
                .recipientName(log.getRecipientName())
                .fineReference(log.getFineReference())
                .sentAt(log.getSentAt())
                .build();
    }
}
