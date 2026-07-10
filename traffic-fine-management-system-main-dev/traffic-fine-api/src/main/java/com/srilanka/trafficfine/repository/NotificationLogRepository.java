package com.srilanka.trafficfine.repository;

import com.srilanka.trafficfine.entity.NotificationLog;
import com.srilanka.trafficfine.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

    List<NotificationLog> findByStatus(NotificationStatus status);

    List<NotificationLog> findByPhoneNumber(String phoneNumber);
}
