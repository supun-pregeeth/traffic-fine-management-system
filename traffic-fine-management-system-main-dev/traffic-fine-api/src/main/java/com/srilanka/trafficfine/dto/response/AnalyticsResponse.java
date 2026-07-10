package com.srilanka.trafficfine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    /** District → total collected (LKR) */
    private Map<String, BigDecimal> collectionsByDistrict;

    /** Category ID → total collected (LKR) */
    private Map<String, BigDecimal> collectionsByCategory;

    /** Date/Month label → total collected (LKR) */
    private Map<String, BigDecimal> revenueSummary;

    /** Grand total across all paid fines */
    private BigDecimal grandTotal;

    /** Total number of paid fines */
    private Long totalPaidFines;

    /** Total number of pending fines */
    private Long totalPendingFines;
}
