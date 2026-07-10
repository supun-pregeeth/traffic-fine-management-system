package com.srilanka.trafficfine.repository;

import com.srilanka.trafficfine.entity.Payment;
import com.srilanka.trafficfine.entity.TrafficFine;
import com.srilanka.trafficfine.enums.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByFineAndTransactionStatus(TrafficFine fine, TransactionStatus status);

    List<Payment> findByTransactionStatus(TransactionStatus status);

    /**
     * Daily revenue: sum of successful payments grouped by date.
     */
    @Query("SELECT CAST(p.paidAt AS date), SUM(p.amount) FROM Payment p " +
           "WHERE p.transactionStatus = 'SUCCESS' " +
           "GROUP BY CAST(p.paidAt AS date) ORDER BY CAST(p.paidAt AS date) DESC")
    List<Object[]> dailyRevenueSummary();

    /**
     * Monthly revenue: sum of successful payments grouped by year-month.
     */
    @Query("SELECT FUNCTION('TO_CHAR', p.paidAt, 'YYYY-MM'), SUM(p.amount) FROM Payment p " +
           "WHERE p.transactionStatus = 'SUCCESS' " +
           "GROUP BY FUNCTION('TO_CHAR', p.paidAt, 'YYYY-MM') " +
           "ORDER BY FUNCTION('TO_CHAR', p.paidAt, 'YYYY-MM') DESC")
    List<Object[]> monthlyRevenueSummary();
}
