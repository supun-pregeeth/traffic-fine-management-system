package com.srilanka.trafficfine.dto.request;

import com.srilanka.trafficfine.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PayFineRequest {

    @NotBlank(message = "Reference number is required")
    private String referenceNumber;

    @NotBlank(message = "Category ID is required")
    private String categoryId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    /**
     * Optional: external transaction reference (card/online payments).
     */
    private String transactionReference;
}
