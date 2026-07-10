package com.srilanka.trafficfine.repository;

import com.srilanka.trafficfine.entity.TrafficFine;
import com.srilanka.trafficfine.entity.User;
import com.srilanka.trafficfine.enums.FineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrafficFineRepository extends JpaRepository<TrafficFine, Long> {

    Optional<TrafficFine> findByReferenceNumber(String referenceNumber);

    List<TrafficFine> findByIssuedTo(User driver);

    List<TrafficFine> findByIssuedToAndStatus(User driver, FineStatus status);

    List<TrafficFine> findByStatus(FineStatus status);

    boolean existsByReferenceNumber(String referenceNumber);

    /**
     * Aggregate total collected amount per district (only PAID fines).
     */
    @Query("SELECT tf.district, SUM(tf.amount) FROM TrafficFine tf " +
           "WHERE tf.status = 'PAID' GROUP BY tf.district ORDER BY SUM(tf.amount) DESC")
    List<Object[]> sumCollectionsByDistrict();

    /**
     * Aggregate total collected amount per category (only PAID fines).
     */
    @Query("SELECT tf.categoryId, SUM(tf.amount) FROM TrafficFine tf " +
           "WHERE tf.status = 'PAID' GROUP BY tf.categoryId ORDER BY SUM(tf.amount) DESC")
    List<Object[]> sumCollectionsByCategory();
}
