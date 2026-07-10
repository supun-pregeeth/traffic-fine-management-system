package com.srilanka.trafficfine.controller;

import com.srilanka.trafficfine.dto.request.CreateFineRequest;
import com.srilanka.trafficfine.dto.response.ApiResponse;
import com.srilanka.trafficfine.dto.response.FineResponse;
import com.srilanka.trafficfine.service.FineService;
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

import java.util.List;

/**
 * Traffic Fine controller.
 *
 * - POST /fines              → OFFICER only (issue a new fine)
 * - GET  /fines/{ref}        → OFFICER, DRIVER, ADMIN (lookup by reference)
 * - GET  /fines/driver/{id}  → OFFICER, ADMIN, DRIVER (list driver's fines)
 * - GET  /fines              → ADMIN only (all fines)
 */
@RestController
@RequestMapping("/fines")
@RequiredArgsConstructor
@Tag(name = "Traffic Fines", description = "Issue and query traffic fines")
@SecurityRequirement(name = "Bearer Authentication")
public class FineController {

    private final FineService fineService;

    @PostMapping
    @PreAuthorize("hasRole('OFFICER')")
    @Operation(summary = "Issue a new traffic fine", description = "Officer issues a fine to a driver")
    public ResponseEntity<ApiResponse<FineResponse>> createFine(
            @Valid @RequestBody CreateFineRequest request,
            Authentication authentication) {

        String officerEmail = authentication.getName();
        FineResponse fine = fineService.createFine(request, officerEmail);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Fine issued successfully", fine));
    }

    @GetMapping("/{referenceNumber}")
    @PreAuthorize("hasAnyRole('OFFICER', 'DRIVER', 'ADMIN')")
    @Operation(summary = "Get fine by reference number")
    public ResponseEntity<ApiResponse<FineResponse>> getFineByReference(
            @PathVariable String referenceNumber) {

        FineResponse fine = fineService.getFineByReferenceNumber(referenceNumber);
        return ResponseEntity.ok(ApiResponse.success(fine));
    }

    @GetMapping("/driver/{driverId}")
    @PreAuthorize("hasAnyRole('OFFICER', 'DRIVER', 'ADMIN')")
    @Operation(summary = "List all fines for a specific driver")
    public ResponseEntity<ApiResponse<List<FineResponse>>> getFinesByDriver(
            @PathVariable Long driverId) {

        List<FineResponse> fines = fineService.getFinesByDriver(driverId);
        return ResponseEntity.ok(ApiResponse.success(fines));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all fines (Admin only)")
    public ResponseEntity<ApiResponse<List<FineResponse>>> getAllFines() {

        List<FineResponse> fines = fineService.getAllFines();
        return ResponseEntity.ok(ApiResponse.success(fines));
    }
}
