package com.srilanka.trafficfine.service.impl;

import com.srilanka.trafficfine.dto.response.AnalyticsResponse;
import com.srilanka.trafficfine.enums.FineStatus;
import com.srilanka.trafficfine.repository.PaymentRepository;
import com.srilanka.trafficfine.repository.TrafficFineRepository;
import com.srilanka.trafficfine.repository.UserRepository;
import com.srilanka.trafficfine.repository.NotificationLogRepository;
import com.srilanka.trafficfine.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Provides aggregated analytics data for the Admin Portal.
 * All methods are read-only — no data mutations here.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TrafficFineRepository fineRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final NotificationLogRepository notificationLogRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getCollectionsByDistrict() {
        List<Object[]> results = fineRepository.sumCollectionsByDistrict();
        return toMap(results);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getCollectionsByCategory() {
        List<Object[]> results = fineRepository.sumCollectionsByCategory();
        return toMap(results);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getDailyRevenue() {
        List<Object[]> results = paymentRepository.dailyRevenueSummary();
        return toMap(results);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getMonthlyRevenue() {
        List<Object[]> results = paymentRepository.monthlyRevenueSummary();
        return toMap(results);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsResponse getDashboardSummary() {
        long totalPaid    = fineRepository.findByStatus(FineStatus.PAID).size();
        long totalPending = fineRepository.findByStatus(FineStatus.PENDING).size();

        Map<String, BigDecimal> byDistrict = getCollectionsByDistrict();
        Map<String, BigDecimal> byCategory = getCollectionsByCategory();
        Map<String, BigDecimal> monthly    = getMonthlyRevenue();

        BigDecimal grandTotal = byDistrict.values()
                .stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AnalyticsResponse.builder()
                .collectionsByDistrict(byDistrict)
                .collectionsByCategory(byCategory)
                .revenueSummary(monthly)
                .grandTotal(grandTotal)
                .totalPaidFines(totalPaid)
                .totalPendingFines(totalPending)
                .build();
    }

    @Override
    public java.util.List<com.srilanka.trafficfine.entity.User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public java.util.List<com.srilanka.trafficfine.entity.NotificationLog> getAllNotificationLogs() {
        return notificationLogRepository.findAll();
    }

    // ─── Utility ─────────────────────────────────────────────────────────────

    /**
     * Converts a list of [label, sum] object arrays from JPQL aggregate queries
     * into an ordered map preserving the ORDER BY from the query.
     */
    private Map<String, BigDecimal> toMap(List<Object[]> rows) {
        Map<String, BigDecimal> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String key   = row[0] != null ? row[0].toString() : "UNKNOWN";
            BigDecimal value = (BigDecimal) row[1];
            result.put(key, value);
        }
        return result;
    }
}
