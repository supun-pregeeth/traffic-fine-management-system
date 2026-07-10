package com.srilanka.trafficfine.controller;

import com.srilanka.trafficfine.dto.request.PayFineRequest;
import com.srilanka.trafficfine.dto.response.ApiResponse;
import com.srilanka.trafficfine.dto.response.PaymentResponse;
import com.srilanka.trafficfine.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Payment controller.
 *
 * - POST /payments/pay  → DRIVER (pay a fine)
 */
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Pay traffic fines and confirm payment workflow")
@SecurityRequirement(name = "Bearer Authentication")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/pay")
    @PreAuthorize("hasRole('DRIVER')")
    @Operation(
        summary = "Pay a traffic fine",
        description = "Driver submits referenceNumber + categoryId to pay a fine. " +
                      "On success, officer is notified via SMS and fine is marked PAID."
    )
    public ResponseEntity<ApiResponse<PaymentResponse>> payFine(
            @Valid @RequestBody PayFineRequest request,
            Authentication authentication) {

        String driverEmail = authentication.getName();
        PaymentResponse response = paymentService.payFine(request, driverEmail);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment processed successfully", response));
    }
}
