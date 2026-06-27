package com.srilanka.trafficfine.controller;

import com.srilanka.trafficfine.dto.response.AnalyticsResponse;
import com.srilanka.trafficfine.dto.response.ApiResponse;
import com.srilanka.trafficfine.dto.response.PaymentResponse;
import com.srilanka.trafficfine.service.AnalyticsService;
import com.srilanka.trafficfine.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Admin Portal controller — all endpoints require ROLE_ADMIN.
 *
 * - GET /admin/analytics/district   → collections per district
 * - GET /admin/analytics/category   → collections per category
 * - GET /admin/analytics/revenue    → daily or monthly revenue
 * - GET /admin/analytics/dashboard  → full summary in one call
 * - GET /admin/payments             → all payment records
 */
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Analytics", description = "Admin-only analytics and reporting endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final PaymentService paymentService;

    @GetMapping("/analytics/district")
    @Operation(summary = "Total collections grouped by district")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> collectionsByDistrict() {
        return ResponseEntity.ok(
            ApiResponse.success("District-wise collections", analyticsService.getCollectionsByDistrict())
        );
    }

    @GetMapping("/analytics/category")
    @Operation(summary = "Total collections grouped by fine category")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> collectionsByCategory() {
        return ResponseEntity.ok(
            ApiResponse.success("Category-wise collections", analyticsService.getCollectionsByCategory())
        );
    }

    @GetMapping("/analytics/revenue")
    @Operation(
        summary = "Revenue summary",
        description = "Pass ?period=daily for daily breakdown, ?period=monthly for monthly (default)"
    )
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> revenueSummary(
            @RequestParam(defaultValue = "monthly") String period) {

        Map<String, BigDecimal> data = "daily".equalsIgnoreCase(period)
                ? analyticsService.getDailyRevenue()
                : analyticsService.getMonthlyRevenue();

        String label = "daily".equalsIgnoreCase(period) ? "Daily" : "Monthly";
        return ResponseEntity.ok(ApiResponse.success(label + " revenue summary", data));
    }

    @GetMapping("/analytics/dashboard")
    @Operation(summary = "Full analytics dashboard summary (district + category + revenue + totals)")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> dashboardSummary() {
        return ResponseEntity.ok(
            ApiResponse.success("Dashboard analytics", analyticsService.getDashboardSummary())
        );
    }

    @GetMapping("/payments")
    @Operation(summary = "View all payment records")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> allPayments() {
        return ResponseEntity.ok(
            ApiResponse.success("All payment records", paymentService.getAllPayments())
        );
    }
}
