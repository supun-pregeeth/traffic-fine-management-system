package com.srilanka.trafficfine.dto.response;

import com.srilanka.trafficfine.entity.TrafficFine;
import com.srilanka.trafficfine.enums.FineStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FineResponse {

    private Long id;
    private String referenceNumber;
    private String categoryId;
    private String description;
    private BigDecimal amount;
    private FineStatus status;
    private String district;
    private String vehicleNumber;

    // Officer info
    private Long officerId;
    private String officerName;

    // Driver info
    private Long driverId;
    private String driverName;
    private String driverEmail;

    private LocalDateTime issuedAt;

    /**
     * Factory method — maps entity to DTO without exposing internals.
     */
    public static FineResponse from(TrafficFine fine) {
        return FineResponse.builder()
                .id(fine.getId())
                .referenceNumber(fine.getReferenceNumber())
                .categoryId(fine.getCategoryId())
                .description(fine.getDescription())
                .amount(fine.getAmount())
                .status(fine.getStatus())
                .district(fine.getDistrict())
                .vehicleNumber(fine.getVehicleNumber())
                .officerId(fine.getIssuedBy().getId())
                .officerName(fine.getIssuedBy().getName())
                .driverId(fine.getIssuedTo().getId())
                .driverName(fine.getIssuedTo().getName())
                .driverEmail(fine.getIssuedTo().getEmail())
                .issuedAt(fine.getIssuedAt())
                .build();
    }
}
