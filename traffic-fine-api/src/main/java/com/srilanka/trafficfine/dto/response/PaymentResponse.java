package com.srilanka.trafficfine.dto.response;

import com.srilanka.trafficfine.entity.Payment;
import com.srilanka.trafficfine.enums.PaymentMethod;
import com.srilanka.trafficfine.enums.TransactionStatus;
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
public class PaymentResponse {

    private Long id;
    private String fineReferenceNumber;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private TransactionStatus transactionStatus;
    private String transactionReference;
    private LocalDateTime paidAt;

    // Populated on success for notification confirmation
    private String notificationStatus;
    private String message;

    public static PaymentResponse from(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .fineReferenceNumber(payment.getFine().getReferenceNumber())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .transactionStatus(payment.getTransactionStatus())
                .transactionReference(payment.getTransactionReference())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
