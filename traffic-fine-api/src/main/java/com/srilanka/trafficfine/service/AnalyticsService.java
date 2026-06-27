package com.srilanka.trafficfine.service;

import com.srilanka.trafficfine.dto.response.AnalyticsResponse;
import com.srilanka.trafficfine.dto.response.PaymentResponse;

import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

public interface AnalyticsService {

    Map<String, BigDecimal> getCollectionsByDistrict();

    Map<String, BigDecimal> getCollectionsByCategory();

    Map<String, BigDecimal> getDailyRevenue();

    Map<String, BigDecimal> getMonthlyRevenue();

    AnalyticsResponse getDashboardSummary();
}
