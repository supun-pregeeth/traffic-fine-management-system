package com.srilanka.trafficfine.entity;

import com.srilanka.trafficfine.enums.FineStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a traffic fine issued by a police officer to a driver.
 */
@Entity
@Table(name = "traffic_fines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficFine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_number", unique = true, nullable = false, length = 20)
    private String referenceNumber;

    @Column(name = "category_id", nullable = false, length = 50)
    private String categoryId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private FineStatus status = FineStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by_id", nullable = false)
    private User issuedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_to_id", nullable = false)
    private User issuedTo;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(name = "vehicle_number", length = 20)
    private String vehicleNumber;

    @CreationTimestamp
    @Column(name = "issued_at", updatable = false)
    private LocalDateTime issuedAt;
}
